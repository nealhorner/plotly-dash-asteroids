from dash import html

from component_ids import ComponentIds


def button(id: ComponentIds, text: str, style: dict = None):
    if style is None:
        style = {}
    return html.Button(
        text,
        id=id,
        n_clicks=0,
        className="button",
        style={
            **style,
        },
    )
