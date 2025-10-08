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

### Generate Requirements.txt

The requirements.txt file is generated automatically by the `generate-requirements.yml` workflow.

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
