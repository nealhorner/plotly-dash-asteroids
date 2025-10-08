# Plotly Dash Asteroids Game

A retro-themed Asteroids game built with Plotly Dash featuring real-time charts and interactive controls.

## Features

- Classic Asteroids gameplay with spaceship, asteroids, and bullets
- Real-time updating charts showing score, lives, and game statistics
- Retro theme with black background and green accents
- Interactive controls for game settings
- Responsive design with modern UI components

## Installation

This project uses `uv` for dependency management. To get started:

```bash
# Install uv if you haven't already
curl -LsSf https://astral.sh/uv/install.sh | sh

# Install dependencies
uv sync

# Run the application
uv run python run.py
```

## Development

### Code Quality

This project uses Ruff for linting and formatting:

```bash
# Check for linting issues
uv run ruff check .

# Fix auto-fixable linting issues
uv run ruff check . --fix

# Format code
uv run ruff format .

# Run both linting and formatting
uv run ruff check . --fix && uv run ruff format .
```

### Running the Application

```bash
uv run python src/app.py
```

## Game Controls

- **Arrow Keys**: Move the spaceship
- **Spacebar**: Fire bullets
- **R**: Reset the game

## Game Settings

- **Game Speed**: Adjust the overall game speed
- **Asteroid Count**: Set the number of asteroids
- **Difficulty**: Choose between Easy, Medium, and Hard

## Development

The application is built with:
- **Dash**: Web application framework
- **Plotly**: Interactive charts and visualizations
- **Bootstrap**: UI components and styling
- **NumPy**: Mathematical operations for game physics
