# Debug Master – AI-Powered Code Debugging Game

## Overview
Debug Master is an interactive learning platform built with **React** and **Firebase** that helps developers sharpen their debugging skills.  
In an era where we rely heavily on AI, this app serves as a fun, engaging way to stay sharp — using AI itself to generate challenges that reveal gaps in our knowledge.

The app presents users with **broken code** that they must fix, with challenges across **JavaScript** and **React**, three difficulty levels, and real-time validation.

---

## 📸 Project Snapshots

| Home Page | Login |
|:---:|:---:|
| <img width="960" height="568" alt="dm1" src="https://github.com/user-attachments/assets/5c8b4f04-5ad0-4442-9ed9-6f52a3958661" />
 | <img width="960" height="568" alt="dm2" src="https://github.com/user-attachments/assets/17f8dd7c-36f1-43ce-81d6-1f7e9ac4fd0c" />
 |

| Start Debugging | Progress Tracking |
|:---:|:---:|
| <img width="960" height="568" alt="dm3" src="https://github.com/user-attachments/assets/1c12531e-70c8-47ec-8961-00e47f1b7cbc" />
 | <img width="960" height="568" alt="dm4" src="https://github.com/user-attachments/assets/85ec71f0-3fbc-4c09-bc52-3be67bf528c0" />
 |

---

## Key Features

### 1. User Authentication
- Sign up / Log in with Firebase Authentication.  
- Progress saved per user account.  
- Personal dashboard showing completed challenges and skill levels.

### 2. Language Selection
- Choose between **JavaScript** or **React** challenges.  
- Each language has its own curated challenge bank.  
- AI generates fresh challenges dynamically.

### 3. Three Difficulty Levels
- **Soft:** Basic syntax errors and simple bugs.  
- **Medium:** Logic errors and edge cases.  
- **Hard:** Complex bugs, async issues, and React-specific problems.

### 4. AI-Generated Challenges
- OpenAI integration creates broken code snippets.  
- Each challenge is unique and appropriate for the selected level.  
- Challenges include hints and expected output.

### 5. Split-Screen Code Editor
- Left panel: Broken code (read-only)  
- Right panel: Your fix (editable with syntax highlighting)  
- Side-by-side comparison for easy debugging.

### 6. Instant Validation
- Submit your fix and get immediate feedback.  
- Validation checks against expected output and code patterns.  
- Success/failure messages with explanations.

### 7. Hint System
- Stuck? Request a hint.  
- Progressive hints (gentle nudge → more specific guidance → solution approach).  
- Hint usage tracked but doesn't affect scoring.

### 8. Progress Tracking
- Track completion rates by language and difficulty.  
- Visual progress charts showing improvement over time.  
- Badges and achievements for milestones.

---

## Database Structure

### **Firestore Collections**

| Collection | Fields | Description |
|------------|--------|-------------|
| `users` | `displayName`, `email`, `createdAt` | User profiles |
| `progress` | `userId`, `language`, `difficulty`, `completed`, `attempts`, `hintsUsed` | Challenge completion data |
| `achievements` | `userId`, `badge`, `earnedAt` | User achievements |

### **Realtime Features**
- Challenge generation via OpenAI API (serverless function).  
- Real-time validation results.  
- Live progress updates.

---

## Files and Structure
