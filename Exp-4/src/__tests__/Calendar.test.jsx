import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import postsReducer from "../store/postsSlice";
import { Calendar } from "../components/Calendar";

// Build an isolated store per test with deterministic, fixed-date posts
// (avoids flaky tests from the "today + N days" sample data).
function renderWithStore(preloadedPosts) {
  const store = configureStore({
    reducer: { posts: postsReducer },
    preloadedState: {
      posts: { items: preloadedPosts, selectedPostId: null },
    },
  });
  render(
    <Provider store={store}>
      <Calendar />
    </Provider>,
  );
  return store;
}

// Build dates relative to "today" so the test stays valid regardless of
// when it's run, while guaranteeing both dates fall in the visible month
// (the calendar opens on the current month by default).
const pad = (n) => String(n).padStart(2, "0");
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const today = new Date();
const midMonth = new Date(today.getFullYear(), today.getMonth(), 10);
const laterInMonth = new Date(today.getFullYear(), today.getMonth(), 15);
const SOURCE_DATE = toISO(midMonth);
const TARGET_DATE = toISO(laterInMonth);

const samplePost = {
  id: "post-1",
  title: "Launch announcement",
  platform: "twitter",
  date: SOURCE_DATE,
  time: "09:00",
  status: "scheduled",
  content: "We are launching soon.",
};

describe("Calendar", () => {
  test("renders the current month's weekday headers", () => {
    renderWithStore([samplePost]);
    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach((wd) => {
      expect(screen.getByText(wd)).toBeInTheDocument();
    });
  });

  test("maps a post onto the correct day cell", () => {
    renderWithStore([samplePost]);
    const dayCell = screen.getByTestId("calendar-day-" + SOURCE_DATE + "");
    expect(within(dayCell).getByText("Launch announcement")).toBeInTheDocument();
  });

  test("clicking a post event opens the edit modal with its data", () => {
    renderWithStore([samplePost]);
    fireEvent.click(screen.getByTestId("post-event-post-1"));
    expect(screen.getByTestId("event-modal")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Launch announcement")).toBeInTheDocument();
  });

  test("editing and saving updates the post title on the calendar", () => {
    renderWithStore([samplePost]);
    fireEvent.click(screen.getByTestId("post-event-post-1"));
    const titleInput = screen.getByDisplayValue("Launch announcement");
    fireEvent.change(titleInput, { target: { value: "Updated launch post" } });
    fireEvent.click(screen.getByText("Save"));
    expect(screen.getByText("Updated launch post")).toBeInTheDocument();
  });

  test("deleting a post removes it from the calendar", () => {
    renderWithStore([samplePost]);
    fireEvent.click(screen.getByTestId("post-event-post-1"));
    fireEvent.click(screen.getByText("Delete"));
    expect(screen.queryByText("Launch announcement")).not.toBeInTheDocument();
  });

  test("drag-and-drop reschedules a post to the target day", () => {
    renderWithStore([samplePost]);

    const sourceEvent = screen.getByTestId("post-event-post-1");
    const targetDay = screen.getByTestId("calendar-day-" + TARGET_DATE + "");

    // Minimal DataTransfer mock, since jsdom doesn't implement it.
    const dataTransfer = {
      data: {},
      setData(type, val) {
        this.data[type] = val;
      },
      getData(type) {
        return this.data[type];
      },
    };

    fireEvent.dragStart(sourceEvent, { dataTransfer });
    fireEvent.dragOver(targetDay, { dataTransfer });
    fireEvent.drop(targetDay, { dataTransfer });

    expect(within(targetDay).getByText("Launch announcement")).toBeInTheDocument();
    const originalDay = screen.getByTestId("calendar-day-" + SOURCE_DATE + "");
    expect(within(originalDay).queryByText("Launch announcement")).not.toBeInTheDocument();
  });

  test("creates a new post from the UI and shows it on the calendar", () => {
    renderWithStore([samplePost]);

    fireEvent.click(screen.getByRole("button", { name: /new post/i }));
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "Quarterly recap" } });
    fireEvent.change(screen.getByLabelText(/platform/i), { target: { value: "linkedin" } });
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: TARGET_DATE } });
    fireEvent.change(screen.getByLabelText(/time/i), { target: { value: "14:45" } });
    fireEvent.change(screen.getByLabelText(/content/i), { target: { value: "Our quarterly recap is live." } });
    fireEvent.click(screen.getByRole("button", { name: /save post/i }));

    expect(screen.getByText("Quarterly recap")).toBeInTheDocument();
    expect(screen.getByTestId("calendar-day-" + TARGET_DATE)).toHaveTextContent("Quarterly recap");
  });
});
