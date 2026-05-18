# CLI Fitness Tracker

A simple Python command-line fitness tracker that lets users log workouts, view previous workouts, and generate training summarie

## Features

- Add new workouts
- Save workouts to a local text file
- View previous workouts
- View overall workout summary
- Track:
  - Sessions logged
  - Days trained
  - Total volume
  - Volume per lift
  - Max lifts
- Reset workout data
- Basic input validation

## Tech Used

- Python
- File handling
- CSV-style text storage
- Command-line interface

## How to Run

Make sure Python is installed

Run: python3 fitness_tracker.py

## Workout Format

Each workout records:

* Date
* Lift
* Weight
* Reps
* Sets

Supported lifts:

* Bench Press
* Squat
* Deadlift

## Future Improvements

* Add weekly progress summaries
* Add PR detection
* Add SQLite database storage
* Add charts and analytics
* Build a React frontend
* Turn into a full fitness dashboard

## Week 2 Features

### Workout Analytics

- Total workout volume
- Volume per lift
- Max lifts
- Average session volume
- Best volume session
- Most trained lift
- Daily training breakdown

### Improvements

- Structured workout loading
- Cleaner output formatting
- Helper function refactoring
- Better code organisation

## Week 3 Features

### SQLite Database Integration

- Replaced text-file storage with SQLite
- Added database setup and connection helpers
- Added SQL-based analytics queries
- Added workout filtering using SQL WHERE clauses
- Added grouped statistics using SQL aggregation

### SQL Concepts Used

- SELECT
- INSERT
- WHERE
- GROUP BY
- COUNT
- SUM
- MAX
- ORDER BY

### Architecture Improvements

- Refactored into helper functions
- Separated database logic from app logic
- Improved maintainability and scalability

## Week 4 Features

### React Frontend

- Built a Vite React frontend
- Added workout form UI
- Added workout list component
- Added summary cards
- Added lift filters
- Added basic dashboard layout

### React Concepts Used

- Components
- Props
- useState
- Event handling
- Conditional rendering
- List rendering with map
- Basic derived state

## Week 5 Features

### PR Detection Logic

- Added personal record detection
- Added previous max comparison
- Added PR badges
- Added PR improvement amount
- Added PR improvement percentage
- Added next target suggestions

### Logic Concepts Used

- Filtering arrays
- Calculating max values
- Conditional rendering
- Derived state
- Comparison logic
- Edge-case testing

## Week 6 Features

### Full-Stack Integration

- Added Flask backend API
- Added GET `/workouts` endpoint
- Added POST `/workouts` endpoint
- Connected React frontend to Flask backend
- Connected backend to SQLite database
- Added persistent workout storage
- Added loading and error states

### Architecture

React Frontend
↓
Flask API
↓
SQLite Database
