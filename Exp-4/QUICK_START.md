# Quick Start Guide - Exp-4 Calendar Application

## 🎯 What is This?

A production-ready **interactive calendar scheduling application** built with React, Redux, and modern performance optimizations. Supports:
- 📅 Month-view calendar with drag-and-drop scheduling
- 📝 Edit posts with modal interface
- 🎨 Color-coded posts by platform
- ⚡ Optimized rendering with React.memo
- 🧪 Comprehensive test coverage

---

## 🚀 Quick Start (3 steps)

### 1. Start the Development Server
```bash
cd Exp-4
npm run dev
```
**Output**: `Local: http://localhost:5174/`

### 2. Open in Browser
Visit http://localhost:5174 and interact with the calendar

### 3. Try the Features
- 🖱️ **Click** a post to edit/delete
- 🎯 **Drag** a post to a new date to reschedule
- ⬅️ **Navigate** months with Previous/Next buttons
- ⏰ **Click "Today"** to jump to current month

---

## 📋 Common Commands

```bash
# Development
npm run dev              # Start dev server (port 5174)

# Testing
npm test                 # Run all tests once
npm run test:watch      # Watch mode (auto-rerun on change)
npm run test:coverage   # Generate coverage report

# Code Quality
npm run lint             # Fix ESLint errors
npm run format           # Auto-format with Prettier

# Production
npm run build            # Create optimized build
npm run preview          # Preview production build
```

---

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Calendar.jsx    # Main calendar container
│   ├── CalendarDay.jsx # Day cell (memoized)
│   ├── PostEvent.jsx   # Post badge (memoized)
│   └── EventModal.jsx  # Edit/delete modal
├── hooks/
│   └── useCalendarGrid.js  # useMemo hooks for performance
├── store/
│   ├── store.js        # Redux store
│   └── postsSlice.js   # Redux reducer/actions
├── __tests__/          # Test files
│   ├── Calendar.test.jsx
│   ├── memoization.test.jsx
│   ├── useCalendarGrid.test.js
│   └── postsSlice.test.js
├── index.css           # Global styles
└── App.jsx             # Root component
```

---

## 🎮 User Interface

### Calendar View
```
┌─────────────────────────────────┐
│ < Today >  January 2025         │  ← Month navigation
├─────────────────────────────────┤
│ Sun  Mon  Tue  Wed  Thu  Fri Sat│  ← Weekday headers
├─────────────────────────────────┤
│  1    2    3    4    5    6   7 │
│                            ┌──┐  │
│  8  [9]  10   11   12   13  14│  ← Today is highlighted (9)
│      ├─────────┐
│      │ 09:00   │
│      │ Post 1  │← Can drag to another day
│      └─────────┘
│ 15   16   17   18   19   20  21 │
│                            ┌──┐
│                            │21│
│                            │📝│← Draft badge
│                            └──┘
├─────────────────────────────────┤
│ (Muted dates from adjacent month)
└─────────────────────────────────┘
```

### Edit Modal
```
┌────────────────────────────────────┐
│ Edit Post              [✕]         │
├────────────────────────────────────┤
│ Title:   [New Product Launch.....] │
│ Content: [Multi-line text editor..] │
│ Platform:[Twitter ▼]               │
│ Date:    [2025-01-15]              │
│ Time:    [09:00]                   │
├────────────────────────────────────┤
│  [Cancel]               [Delete] [✓Save]
└────────────────────────────────────┘
```

---

## 🔧 Performance Optimizations Explained

### 1. React.memo (Prevents Re-renders)
```javascript
// Only re-render if this day's posts actually changed
export const CalendarDay = memo(CalendarDayBase, areEqual);
export const PostEvent = memo(PostEventBase);
```
**Benefit**: 40+ day cells skip re-render when editing one post

### 2. useMemo (Caches Calculations)
```javascript
// Only recalculate date grid when month changes
const days = useMemo(() => generateDays(year, month), [year, month]);

// Only re-group posts when posts array changes
const postsByDate = useMemo(() => groupPostsByDate(posts), [posts]);
```
**Benefit**: Saves O(42) date calculations per render

### 3. useCallback (Stable Function References)
```javascript
// These handlers don't get recreated on every render
const handleSelectPost = useCallback((id) => setSelectedPostId(id), []);
const handleDropPost = useCallback((postId, date) => dispatch(reschedulePost(...)), [dispatch]);
```
**Benefit**: Memo comparisons work correctly

---

## 🧪 Testing Guide

### Run Tests
```bash
npm test
```

### Test Suites (4 files, 15+ tests)

**1. Calendar Integration Tests** (`Calendar.test.jsx`)
- Render weekday headers ✓
- Map posts to day cells ✓
- Click to open modal ✓
- Edit and save ✓
- Delete posts ✓
- Drag-and-drop ✓

**2. Performance Tests** (`memoization.test.jsx`)
- Verify unrelated components don't re-render ✓

**3. Hook Tests** (`useCalendarGrid.test.js`)
- Generate 42-day grid ✓
- Group posts by date ✓
- Sort posts by time ✓

**4. Redux Tests** (`postsSlice.test.js`)
- Add post ✓
- Update post ✓
- Delete post ✓
- Reschedule post ✓

---

## 💡 Key Technical Concepts

### Temporal Data Visualization
- Calendar is a **2D grid** representing time (dates)
- Posts are **badges** positioned in their date cells
- Colors indicate **platform** (Twitter, Instagram, etc.)

### Drag-and-Drop
```javascript
// Source: PostEvent
onDragStart = (e) => e.dataTransfer.setData("text/post-id", postId)

// Target: CalendarDay
onDrop = (e) => {
  const postId = e.dataTransfer.getData("text/post-id")
  dispatch(reschedulePost({ id: postId, date: newDate }))
}
```

### Redux State Shape
```javascript
{
  posts: {
    items: [
      { id: "p1", title: "Launch", date: "2025-01-15", time: "09:00", ... },
      { id: "p2", title: "Update", date: "2025-01-20", time: "14:00", ... },
    ],
    selectedPostId: "p1"
  }
}
```

---

## 🎓 Learning Outcomes

After completing this project, you understand:

✅ **React Fundamentals**
- Hooks (useState, useMemo, useCallback)
- Props & component composition
- Conditional rendering

✅ **Performance Engineering**
- Memoization & caching
- Re-render prevention
- Performance profiling

✅ **State Management**
- Redux for application state
- Reducers & actions
- Selector patterns

✅ **Testing Strategies**
- Unit tests (hooks, reducers)
- Integration tests (components)
- Performance tests (memo behavior)
- User interaction testing

✅ **Modern Tooling**
- Vite (fast bundler)
- Jest (test runner)
- ESLint + Prettier (code quality)
- Babel (transpilation)

---

## 🚨 Troubleshooting

### Port 5173 Already in Use?
The dev server automatically tries the next port (5174, 5175, etc.)

### Tests Not Running?
```bash
npm install                    # Reinstall dependencies
rm -r node_modules jest_cache  # Clear cache
npm test                       # Try again
```

### ESLint Errors?
```bash
npm run lint                   # Auto-fix errors
npm run format                 # Format code
```

### Build Fails?
```bash
npm run build                  # Check error output
npm run preview                # Test the build locally
```

---

## 📚 Further Learning

### Experiment 1.4.1 Topics
- Information Visualization
- Temporal Data Representation
- Human-Computer Interaction (HCI)
- Direct Manipulation Interfaces

### Experiment 1.4.2 Topics
- Performance Profiling
- Memory vs. CPU Trade-offs
- Render Cycle Optimization
- Test-Driven Development (TDD)

### Next Steps
- Add recurring posts
- Implement time-slot conflict detection
- Build analytics dashboard
- Add user authentication
- Implement offline sync

---

## 📞 Support

See the detailed documentation files:
- **IMPLEMENTATION_SUMMARY.md** - Technical deep-dive
- **COMPLETION_CHECKLIST.md** - Full requirements verification

---

## ✨ You're All Set!

Your calendar application is:
- ✅ Fully functional and running
- ✅ Optimized for performance
- ✅ Thoroughly tested
- ✅ Ready for production

**Happy scheduling! 📅**
