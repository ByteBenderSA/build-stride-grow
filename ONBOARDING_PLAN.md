# CompanAI Dual-Path Onboarding Implementation Plan

---

## **Phase 1: Welcome Modal & Path Selection**

**Description:**
Implement a modal that appears on first login, allowing users to choose between Beginner, Pro, or Both onboarding paths. Store the user's choice for future sessions.

**Key Tasks:**
- Design and build the welcome modal UI
- Add options: "I'm New to Modern Tech Stacks", "I'm Experienced / Just Want to Build", "I want to do both!"
- Store user selection (in Firestore or local storage)
- Ensure modal only appears for new users or until a choice is made

---

## **Phase 2: Conditional Onboarding Flow**

**Description:**
Render onboarding steps, product tours, and dashboard content based on the user's selected path.

**Key Tasks:**
- Implement logic to check user onboarding path
- For Beginner: show full onboarding, product tour, and learning path
- For Pro: skip onboarding, show minimal dashboard, hide or minimize lessons
- For Both: allow toggling between learning and building features

---

## **Phase 3: Dashboard Personalization**

**Description:**
Personalize the dashboard experience based on the onboarding path, surfacing relevant actions and content.

**Key Tasks:**
- For Beginner: show learning progress, next lesson, achievements
- For Pro: show recent projects, quick actions, advanced features
- For Both: blend both sets of features, allow easy switching

---

## **Phase 4: Settings & Flexibility**

**Description:**
Allow users to switch onboarding paths at any time from their profile or settings.

**Key Tasks:**
- Add a toggle or dropdown in settings/profile
- Ensure UI updates immediately on path change
- Option to revisit onboarding or lessons if previously skipped

---

## **Phase 5: Gamification & Tone Adjustment**

**Description:**
Adjust gamification, achievements, and UI tone based on the selected path.

**Key Tasks:**
- For Beginner: keep achievements, confetti, friendly tone
- For Pro: minimize or hide gamification, use a more professional tone
- For Both: allow user to choose which elements to display

---

## **Phase 6: QA & User Testing**

**Description:**
Test the onboarding experience for all user types to ensure smooth transitions and satisfaction.

**Key Tasks:**
- Test onboarding for new and returning users
- Test switching paths and UI updates
- Gather feedback and iterate

---

## **Phase 7: Launch & Feedback Loop**

**Description:**
Deploy the new onboarding flow and collect user feedback for continuous improvement.

**Key Tasks:**
- Deploy to production
- Add feedback prompts after onboarding
- Monitor analytics and user satisfaction
- Plan for future enhancements 