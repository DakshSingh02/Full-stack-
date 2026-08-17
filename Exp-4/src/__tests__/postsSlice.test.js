import reducer, { addPost, updatePost, deletePost, reschedulePost } from "../store/postsSlice";

const baseState = {
  items: [
    {
      id: "a1",
      title: "Old title",
      platform: "twitter",
      date: "2026-08-20",
      time: "09:00",
      status: "scheduled",
      content: "x",
    },
  ],
  selectedPostId: null,
};

describe("postsSlice reducer", () => {
  test("addPost appends a new post with a generated id", () => {
    const next = reducer(
      baseState,
      addPost({
        title: "New post",
        platform: "instagram",
        date: "2026-08-22",
        time: "10:00",
        content: "hello",
      }),
    );
    expect(next.items).toHaveLength(2);
    expect(next.items[1]).toMatchObject({
      title: "New post",
      platform: "instagram",
      status: "draft",
    });
    expect(next.items[1].id).toBeTruthy();
  });

  test("updatePost merges changes into the matching post only", () => {
    const next = reducer(baseState, updatePost({ id: "a1", changes: { title: "Updated title" } }));
    expect(next.items[0].title).toBe("Updated title");
    expect(next.items[0].platform).toBe("twitter"); // untouched fields preserved
  });

  test("deletePost removes the post with the matching id", () => {
    const next = reducer(baseState, deletePost("a1"));
    expect(next.items).toHaveLength(0);
  });

  test("reschedulePost (drag-and-drop target) updates the date", () => {
    const next = reducer(baseState, reschedulePost({ id: "a1", date: "2026-09-01" }));
    expect(next.items[0].date).toBe("2026-09-01");
    expect(next.items[0].time).toBe("09:00"); // time unchanged when not provided
  });

  test("reschedulePost updates date and time together", () => {
    const next = reducer(
      baseState,
      reschedulePost({ id: "a1", date: "2026-09-01", time: "14:30" }),
    );
    expect(next.items[0]).toMatchObject({ date: "2026-09-01", time: "14:30" });
  });

  test("reschedulePost is a no-op for an unknown id", () => {
    const next = reducer(baseState, reschedulePost({ id: "does-not-exist", date: "2026-09-01" }));
    expect(next.items[0].date).toBe("2026-08-20");
  });
});
