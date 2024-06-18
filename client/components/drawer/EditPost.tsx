"use client";
import styles from "@/styles/form.module.css";
import PrimaryButton from "../button/PrimaryButton";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { Task } from "@/types/task";
import AddButton from "../button/AddButton";
import { useAuth } from "@/contexts/UserProvider";
import FormItem from "../FormItem";
import { usePosts } from "@/contexts/PostsProvider";
import { POST_CATEGORY } from "@/costants/posts";
import { useEffect, useState } from "react";
import { useDrawer } from "@/contexts/DrawerProvider";

interface FormValues {
  comment?: string;
  tasks: Task[];
}

const EditPost = () => {
  const { authUser } = useAuth();
  const { createPost, updatePost } = usePosts();
  const { handleCloseDrawer, editingPost, setIsEditing } = useDrawer();
  const emptyValues = {
    comment: "",
    tasks: [{ id: undefined, content: "", completed: false }],
  };
  const [defaultValues, setDefaultValues] = useState<FormValues>(emptyValues);
  const {
    register,
    watch,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues });
  const { fields, append } = useFieldArray({
    control,
    name: "tasks",
  });
  const watchComment = watch("comment");
  const watchTasks = watch("tasks");
  const [isEnable, setIsEnable] = useState<boolean>(false);

  const handleAddTask = () => {
    append(emptyValues["tasks"]);
  };

  const handleSubmitSuccess: SubmitHandler<FormValues> = async ({
    comment,
    tasks,
  }: FormValues) => {
    const nonEmptyTasks = tasks.filter((task) => task.content.length > 0);
    if (!!editingPost) {
      await updatePost({
        id: editingPost?.id,
        comment,
        tasks: nonEmptyTasks,
        category: editingPost?.category,
        numOfGood: editingPost?.numOfGood,
        author: editingPost?.author,
      });
    } else {
      await createPost({
        comment,
        tasks: nonEmptyTasks,
        category: POST_CATEGORY.TASK,
        numOfGood: 0,
        author: authUser,
      });
    }
    reset(emptyValues);
    handleCloseDrawer();
  };

  useEffect(() => {
    const nonEmptyDefaultTasks = defaultValues.tasks.filter(
      (task) => task.content.length > 0
    );
    const nonEmptyTasks = watchTasks.filter((task) => task.content.length > 0);

    // 条件を満たすとボタンがクリックできるようになる
    // 【条件】変更がある場合、かつ、タスクが１つ以上存在する場合
    setIsEnable(
      (defaultValues.comment !== watchComment ||
        JSON.stringify(nonEmptyDefaultTasks) !==
          JSON.stringify(nonEmptyTasks)) &&
        nonEmptyTasks.length > 0
    );

    setIsEditing(
      defaultValues.comment !== watchComment ||
        JSON.stringify(nonEmptyDefaultTasks) !== JSON.stringify(nonEmptyTasks)
    );
  }, [watchComment, watchTasks.map((task) => task.content)]);

  useEffect(() => {
    if (!!editingPost) {
      const editingValues = {
        comment: editingPost?.comment,
        tasks:
          editingPost?.tasks.length > 0
            ? editingPost.tasks
            : emptyValues["tasks"],
      };
      setDefaultValues(editingValues);
      reset(editingValues);
    } else {
      setDefaultValues(emptyValues);
      reset(emptyValues);
    }
  }, [editingPost]);

  return (
    <form
      onSubmit={handleSubmit(handleSubmitSuccess)}
      className="flex flex-col gap-y-5"
    >
      <FormItem label="今日のひとこと" memo="250文字以内で入力してください。">
        <textarea
          rows={4}
          placeholder="今日の意気込みは？"
          {...register("comment")}
          className={`${styles.item} ${styles.item_frame}`}
        />
      </FormItem>
      <div className="flex flex-col gap-y-2">
        <div className={styles.container}>
          <div className={styles.label_container}>
            <p className={styles.label}>今日のタスク（必須）</p>
            <p className={styles.memo}>各30文字以内で入力してください。</p>
          </div>
          {fields.map((field, idx) => (
            <div
              key={field.id}
              className={`${styles.checkbox_container} ${styles.item_frame_sm}`}
            >
              <input
                type="checkbox"
                checked={false}
                {...register(`tasks.${idx}.completed`)}
                className={styles.checkbox_disabled}
              />
              <input
                placeholder="今日のタスクは？"
                className={styles.item}
                {...register(`tasks.${idx}.content`)}
              />
            </div>
          ))}
        </div>
        <AddButton onClick={handleAddTask}>タスクを追加する</AddButton>
      </div>
      <div className="ml-auto mr-0">
        <PrimaryButton type="submit" disabled={!isEnable}>
          {!editingPost ? "投稿する" : "保存する"}
        </PrimaryButton>
      </div>
    </form>
  );
};

export default EditPost;
