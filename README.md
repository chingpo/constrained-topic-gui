# Constrained Topic Model

A human-in-the-loop visual explanation system that bridges machine learning interpretations 
and human semantic understanding through interactive drag-and-drop clustering.

![Interactive Workflow](https://raw.githubusercontent.com/chingpo/constrained-topic-gui/main/src/guide.png)

## How It Works

| Step | Action | Output |
|------|--------|--------|
| 1. Human Input | Users drag-and-drop prototypes into semantic clusters | Grouped prototypes |
| 2. Constraint Generation | System extracts pairwise relationships from user groupings | Must-link & cannot-link constraints |
| 3. Model Update | Constrained clustering algorithm learns from human feedback | Refined prototype clusters |
| 4. Explanation | Model generates interpretable visual explanations | Human-aligned outputs |

## Core Innovation
- 🎯 **Interactive Interface**: Drag-and-drop clustering captures human semantic knowledge
- 🔄 **Constraint-Based Learning**: Converts user interactions into machine-readable constraints
- 📊 **Validated Approach**: User study demonstrates improved alignment with human perception

## Authentication System

### Built for Interactive User Studies
This project implements a robust authentication architecture specifically designed for 
**behavioral experiments requiring user login and data persistence**. Common use cases:
- Longitudinal studies where participants return across multiple sessions
- Crowdsourcing experiments (e.g., Yahoo! Crowd Sourcing, MTurk) requiring participant tracking
- Interactive tasks generating sensitive behavioral data requiring secure storage

### Architecture
**Request Layer (`useAxiosPrivate` hook)**
- Auto-injects JWT tokens via Axios interceptors (no manual header configuration needed)
- AbortController-based request cancellation prevents memory leaks
- Unified error/loading state management

**Authentication Flow (`RequireAuth` component)**
- Token validation and automatic redirect on expiration
- localStorage-based session recovery (survives page refresh)
- Flexible routing: unauthenticated users redirected to registration

### For Researchers
This authentication layer is **designed to be reusable**. To adapt for your own study:
1. Configure backend API endpoints in `axios.js`
2. Customize registration form fields for your participant metadata
3. Modify route protection rules in `RequireAuth.js` if needed

The modular design means you can focus on **experiment-specific UI/UX** rather than 
rebuilding authentication infrastructure.
