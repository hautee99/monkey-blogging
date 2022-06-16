import { Button } from "components/button";
import { Radio } from "components/checkbox";
import { Dropdown } from "components/dropdown";
import { Field, FieldCheckboxes } from "components/field";
import ImageUpload from "components/image/ImageUpload";
import { Label } from "components/label";
import Toggle from "components/toggle/Toggle";
import DashboardHeading from "drafts/DashboardHeading";
import { db } from "firebase-app/firebase-config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import useFirebaseImage from "hooks/useFirebaseImage";
import { Input } from "components/input";
import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { postStatus } from "utils/constants";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import ImageUploader from "quill-image-uploader";
Quill.register("modules/imageUploader", ImageUploader);

const PostUpdate = () => {
  const [params] = useSearchParams();
  const postId = params.get("id");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const { handleSubmit, control, setValue, watch, reset, getValues } = useForm({
    mode: "onChange",
  });
  const watchHot = watch("hot");
  const watchStatus = watch("status");

  const imageUrl = getValues("image");
  const imageName = getValues("image_name");

  const { image, setImage, progress, handleSelectImage, handleDeleteImage } =
    useFirebaseImage(setValue, getValues, imageName, deletePostImage);
  async function deletePostImage() {
    const colRef = doc(db, "users", postId);
    await updateDoc(colRef, {
      avatar: "",
    });
  }
  useEffect(() => {
    setImage(imageUrl);
  }, [imageUrl, setImage]);

  useEffect(() => {
    async function fetchData() {
      if (!postId) return;
      const docRef = doc(db, "posts", postId);
      const docSnapshot = await getDoc(docRef);
      console.log(docSnapshot.data());
      if (docSnapshot.data()) {
        reset(docSnapshot.data());
        setSelectCategory(docSnapshot.data()?.category || "");
        setContent(docSnapshot.data()?.content || "");
      }
    }
    fetchData();
  }, [postId, reset]);
  const [selectCategory, setSelectCategory] = useState("");
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    async function getCategoriesData() {
      const colRef = collection(db, "categories");
      const q = query(colRef, where("status", "==", 1));
      const querySnapshot = await getDocs(q);
      let result = [];
      querySnapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setCategories(result);
    }
    getCategoriesData();
  }, []);
  const handleClickOption = async (item) => {
    const colRef = doc(db, "categories", item.id);
    const docData = await getDoc(colRef);
    setValue("category", {
      id: docData.id,
      ...docData.data(),
    });
    setSelectCategory(item);
  };

  const handleUpdatePost = async (values) => {
    const docRef = doc(db, "posts", postId);
    await updateDoc(docRef, {
      content,
    });
    toast.success("Update post successfully");
  };
  const modules = useMemo(
    () => ({
      toolbar: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote"],
        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: "ordered" }, { list: "bullet" }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["link", "image"],
      ],
      ImageUploader: {
        upload: (file) => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve("https://source.unsplash.com/FV3GConVSss/900x500");
            }, 3500);
          });
        },
      },
    }),
    []
  );
  if (!postId) return null;
  return (
    <div>
      <DashboardHeading
        title="Update post"
        desc="update post content"
      ></DashboardHeading>
      <form onSubmit={handleSubmit(handleUpdatePost)}>
        <div className="form-layout">
          <Field>
            <Label>Title</Label>
            <Input
              control={control}
              placeholder="Enter your title"
              name="title"
              required
            ></Input>
          </Field>
          <Field>
            <Label>Slug</Label>
            <Input
              control={control}
              placeholder="Enter your slug"
              name="slug"
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Image</Label>
            <ImageUpload
              onChange={handleSelectImage}
              handleDeleteImage={handleDeleteImage}
              className="h-[250px]"
              progress={progress}
              image={image}
            ></ImageUpload>
          </Field>
          <Field>
            <Label>Category</Label>
            <Dropdown>
              <Dropdown.Select placeholder="Select the category"></Dropdown.Select>
              <Dropdown.List>
                {categories.length > 0 &&
                  categories.map((item) => (
                    <Dropdown.Option
                      key={item.id}
                      onClick={() => handleClickOption(item)}
                    >
                      {item.name}
                    </Dropdown.Option>
                  ))}
              </Dropdown.List>
            </Dropdown>
            {selectCategory?.name && (
              <span className="inline-block p-3 rounded-lg bg-green-50 text-sm text-green-600 font-medium">
                {selectCategory?.name}
              </span>
            )}
          </Field>
        </div>
        <div className="mb-10">
          <Field></Field>
          <Label>Content</Label>
          <div className="w-full entry-content">
            <ReactQuill
              modules={modules}
              theme="snow"
              value={content}
              onChange={setContent}
            ></ReactQuill>
          </div>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Feature post</Label>
            <Toggle
              on={watchHot === true}
              onClick={() => setValue("hot", !watchHot)}
            ></Toggle>
          </Field>
          <Field>
            <Label>Status</Label>
            <FieldCheckboxes>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.APPROVED}
                value={postStatus.APPROVED}
              >
                Approved
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.PENDING}
                value={postStatus.PENDING}
              >
                Pending
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.REJECTED}
                value={postStatus.REJECTED}
              >
                Reject
              </Radio>
            </FieldCheckboxes>
          </Field>
        </div>
        <Button
          type="submit"
          className="mx-auto w-[250px]"
          isLoading={loading}
          disabled={loading}
        >
          Update post
        </Button>
      </form>
    </div>
  );
};

export default PostUpdate;
