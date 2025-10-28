from dash import ClientsideFunction, Input, Output, State, clientside_callback

from component_ids import ComponentIds

# Initial Game state
game_state = {
    "score": 0,
    "lives": 3,
    "level": 1,
    "game_over": False,
    "game_running": False,
    "spaceship": {"x": 400, "y": 300, "angle": 0, "velocity_x": 0, "velocity_y": 0},
    "asteroids": [],
    "bullets": [],
    "game_start_time": None,
    "score_history": [],
    "lives_history": [],
}


clientside_callback(
    ClientsideFunction(
        namespace="clientside", function_name="handle_start_stop_button_click"
    ),
    Output(ComponentIds.DUMMY_OUTPUT, "children", allow_duplicate=True),
    Input(ComponentIds.GAME_START_STOP_BUTTON, "n_clicks"),
    State(ComponentIds.GAME_STATE_STORE, "data"),
    prevent_initial_call=True,
)

clientside_callback(
    ClientsideFunction(
        namespace="clientside", function_name="trigger_game_display_update"
    ),
    Output(ComponentIds.GAME_STATE_STORE, "data", allow_duplicate=True),
    Input(ComponentIds.DUMMY_OUTPUT, "n_clicks"),
    prevent_initial_call=True,
)

clientside_callback(
    ClientsideFunction(
        namespace="clientside", function_name="handle_reset_button_click"
    ),
    Output(ComponentIds.GAME_STATE_STORE, "data", allow_duplicate=True),
    Input(ComponentIds.GAME_RESET_BUTTON, "n_clicks"),
    State(ComponentIds.GAME_RESET_BUTTON, "disabled"),
    prevent_initial_call=True,
)
