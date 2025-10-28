import dash
import plotly.graph_objs as go
from dash import Input, Output, State, ctx

from component_ids import ComponentIds
from layout import layout

# Initialize the Dash app
app = dash.Dash(
    __name__, external_stylesheets=["https://codepen.io/chriddyp/pen/bWLwgP.css"]
)
app.title = "Asteroids Game"

# Serve static files
app.scripts.config.serve_locally = True


# Initialize the app layout
app.layout = layout


# Callbacks
@app.callback(
    [
        Output(ComponentIds.GAME_PAUSED, "hidden"),
        Output(ComponentIds.GAME_STATE_STORE, "data"),
        Output(ComponentIds.GAME_START_STOP_BUTTON, "children"),
    ],
    [
        Input(ComponentIds.GAME_START_STOP_BUTTON, "n_clicks"),
        Input(ComponentIds.GAME_RESET_BUTTON, "n_clicks"),
    ],
    [State(ComponentIds.GAME_STATE_STORE, "data")],
)
def handle_start_stop_button_click(start_clicks, reset_clicks, game_state):
    """Update game info display and handle button clicks"""

    trigger = ctx.triggered_id

    if trigger == ComponentIds.GAME_START_STOP_BUTTON.value:
        if not game_state.get("game_over"):
            game_state["game_running"] = game_state["game_running"] ^ True

    if trigger == ComponentIds.GAME_RESET_BUTTON.value:
        button_text = "Start"
    else:
        if game_state.get("game_running", False) and not game_state.get(
            "game_over", True
        ):
            button_text = "Stop"
        else:
            button_text = "Start"

    hide_game_paused = not game_state.get("game_over") and not game_state.get(
        "game_running"
    )

    return hide_game_paused, game_state, button_text


@app.callback(
    [
        Output(ComponentIds.GAME_SCORE, "children"),
        Output(ComponentIds.GAME_LIVES, "children"),
        Output(ComponentIds.GAME_LEVEL, "children"),
        Output(ComponentIds.SCORE_CHART, "figure"),
        Output(ComponentIds.LIVES_CHART, "figure"),
    ],
    [Input(ComponentIds.GAME_STATE_STORE, "data")],
)
def update_game_info_display(game_state):
    """Update the game info display and real-time charts"""

    # Score chart
    if game_state["score_history"]:
        score_times = [point["time"] for point in game_state["score_history"]]
        score_values = [point["score"] for point in game_state["score_history"]]
    else:
        score_times = [0]
        score_values = [0]

    score_fig = go.Figure()
    score_fig.add_trace(
        go.Scatter(
            x=score_times,
            y=score_values,
            mode="lines",
            name="Score",
            line=dict(color="#00FF00", width=3),
        )
    )
    score_fig.update_layout(
        title="Score Over Time",
        xaxis_title="Time (seconds)",
        yaxis_title="Score",
        paper_bgcolor="#000000",
        plot_bgcolor="#000000",
        font=dict(color="#00FF00", family="Courier New"),
        title_font=dict(color="#00FF00", family="Courier New"),
    )

    # Lives chart
    if game_state["lives_history"]:
        lives_times = [point["time"] for point in game_state["lives_history"]]
        lives_values = [point["lives"] for point in game_state["lives_history"]]
    else:
        lives_times = [0]
        lives_values = [3]

    lives_fig = go.Figure()
    lives_fig.add_trace(
        go.Scatter(
            x=lives_times,
            y=lives_values,
            mode="lines+markers",
            name="Lives",
            line=dict(color="#00FF00", width=3),
            marker=dict(color="#00FF00", size=8),
        )
    )
    lives_fig.update_layout(
        title="Lives Over Time",
        xaxis_title="Time (seconds)",
        yaxis_title="Lives",
        paper_bgcolor="#000000",
        plot_bgcolor="#000000",
        font=dict(color="#00FF00", family="Courier New"),
        title_font=dict(color="#00FF00", family="Courier New"),
    )

    return (
        game_state["score"],
        game_state["lives"],
        game_state["level"],
        score_fig,
        lives_fig,
    )


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8050)
