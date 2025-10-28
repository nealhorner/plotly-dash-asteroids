from dash import dcc, html

from component_ids import ComponentIds
from components import button, container
from game import game_state
from theme import theme

# Theme styling
retro_style = {
    "backgroundColor": theme["backgroundColor"],
    "color": theme["color"],
    "fontFamily": theme["fontFamily"],
    "margin": "0",
    "padding": "20px",
}


layout = html.Div(
    style=retro_style,
    children=[
        html.H1(
            "ASTEROIDS",
            style={
                "color": theme["color"],
                "fontSize": "4em",
                "textShadow": f"0 0 10px {theme['color']}",
                "marginBottom": "20px",
            },
        ),
        html.P(
            [
                "Navigate your spaceship through the asteroid field. Use arrow keys to move, spacebar to fire! Application made with ",
                html.A("Plotly Dash", "https://plotly.com", target="_blank"),
                ". Source code available on ",
                html.A(
                    "GitHub",
                    "https://github.com/nealhorner/plotly-dash-asteroids",
                    target="_blank",
                ),
                ". Make sure to turn on your audio 🔊!",
            ],
            style={"fontSize": "1.2em", "marginBottom": "30px"},
        ),
        # Game Controls
        container(
            [
                html.Div(
                    [
                        html.Label(
                            "Game Speed:",
                            style={"color": theme["color"]},
                        ),
                        dcc.Slider(
                            id="speed-slider",
                            min=1,
                            max=10,
                            step=1,
                            value=5,
                            marks={i: str(i) for i in range(1, 11)},
                            tooltip={"placement": "bottom", "always_visible": True},
                        ),
                    ],
                    style={
                        "width": "30%",
                        "display": "inline-block",
                        "marginRight": "20px",
                    },
                ),
                html.Div(
                    [
                        html.Label(
                            "Asteroid Count:",
                            style={"color": theme["color"]},
                        ),
                        dcc.Slider(
                            id="asteroid-slider",
                            min=3,
                            max=15,
                            step=1,
                            value=5,
                            marks={i: str(i) for i in range(3, 16)},
                            tooltip={"placement": "bottom", "always_visible": True},
                        ),
                    ],
                    style={
                        "width": "30%",
                        "display": "inline-block",
                        "marginRight": "20px",
                    },
                ),
            ],
            style={
                "marginBottom": "30px",
            },
        ),
        # Game Controls Buttons
        html.Div(
            [
                button(
                    ComponentIds.GAME_START_STOP_BUTTON,
                    "Start",
                    style={"minWidth": "100px"},
                ),
                button(
                    ComponentIds.GAME_RESET_BUTTON,
                    "Reset",
                    style={"minWidth": "100px"},
                ),
            ],
            style={
                "marginBottom": "20px",
                "display": "flex",
                "gap": "20px",
                "justifyContent": "start",
            },
        ),
        html.Div(
            children=[
                html.Div(["Score: ", html.Span("0", id=ComponentIds.GAME_SCORE)]),
                html.Div(["Lives: ", html.Span("3", id=ComponentIds.GAME_LIVES)]),
                html.Div(["Level: ", html.Span("1", id=ComponentIds.GAME_LEVEL)]),
                html.Div(
                    "PAUSED",
                    id=ComponentIds.GAME_PAUSED,
                    style={"color": theme["dangerColor"], "marginLeft": "20px"},
                    hidden=True,
                ),
            ],
            style={
                "display": "flex",
                "justifyContent": "start",
                "marginBottom": "10px",
                "fontSize": "1.2em",
                "color": theme["color"],
                "gap": "20px",
            },
        ),
        # Game Board
        container(
            [
                html.Canvas(
                    id=ComponentIds.GAME_CANVAS,
                    width=800,
                    height=600,
                    style={
                        "margin": "0 auto",
                        "display": "block",
                        "backgroundColor": theme["backgroundColor"],
                    },
                ),
            ],
            style={"textAlign": "center", "marginBottom": "30px"},
        ),
        # Real-time Charts
        html.Div(
            [
                html.Div(
                    [dcc.Graph(id="score-chart", style={"height": "300px"})],
                    style={"width": "48%", "display": "inline-block"},
                ),
                html.Div(
                    [dcc.Graph(id="lives-chart", style={"height": "300px"})],
                    style={
                        "width": "48%",
                        "display": "inline-block",
                        "marginLeft": "4%",
                    },
                ),
            ]
        ),
        dcc.Store(id="game-state-store", data=game_state, storage_type="local"),
        html.Script(src="/assets/asteroids.js"),
        html.Div(id=ComponentIds.DUMMY_OUTPUT, hidden=True),
    ],
)
