from dash import html

from theme import theme


def container(children: list, style: dict = None):
    return html.Div(
        children,
        style={
            "padding": "20px",
            "border": f"2px solid {theme['color']}",
            "borderRadius": "10px",
            "boxShadow": f"0 0 10px {theme['color']}",
            **style,
        },
    )
