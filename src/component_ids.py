from enum import Enum


class ComponentIds(str, Enum):
    GAME_CANVAS = "game-canvas"
    GAME_STATE_STORE = "game-state-store"
    GAME_START_STOP_BUTTON = "game-start-stop-button"
    GAME_RESET_BUTTON = "game-reset-button"
    GAME_SPEED_SLIDER = "game-speed-slider"
    GAME_ASTEROID_SLIDER = "game-asteroid-slider"
    GAME_SCORE = "game-score"
    GAME_LIVES = "game-lives"
    GAME_LEVEL = "game-level"
    GAME_PAUSED = "game-paused"
    DUMMY_OUTPUT = "dummy-output"
    SCORE_CHART = "score-chart"
    LIVES_CHART = "lives-chart"
