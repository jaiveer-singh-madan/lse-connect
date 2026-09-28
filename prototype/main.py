from nicegui import ui
import pandas as pd
import os

CSV_FILE = 'profiles.csv'
PRIMARY_RED = '#DA291C'

def load_profiles():
    if os.path.exists(CSV_FILE):
        return pd.read_csv(CSV_FILE)
    return pd.DataFrame(columns=['name', 'year', 'department', 'bio', 'tags'])

def get_all_tags(df):
    tags = set()
    for t in df['tags'].dropna():
        tags.update(t.split(';'))
    return sorted(tags)

@ui.page('/')
def index():
    with ui.column().classes('items-center justify-center w-full h-screen gap-4'):
        ui.label('LSE Connect').classes('text-4xl font-bold').style(f'color: {PRIMARY_RED}')
        ui.label('Your campus. Your network.').classes('text-gray-500')
        ui.button('Enter LSE Connect', on_click=lambda: ui.navigate.to('/discover')).props('rounded').style(
            f'background-color: {PRIMARY_RED}; color: white; padding: 12px 32px;'
        )

@ui.page('/discover')
def discover():
    df_all = load_profiles()
    all_tags = get_all_tags(df_all)
    selected_tags = set()

    with ui.row().classes('w-full items-center justify-between p-4').style(f'background-color: {PRIMARY_RED};'):
        ui.label('LSE Connect').classes('text-xl font-bold text-white')

    with ui.column().classes('w-full max-w-2xl mx-auto p-4 gap-3'):
        search = ui.input(placeholder='Search by name, department, or interest...').classes('w-full').props('outlined rounded-lg')
        ui.label('Filter by interest').classes('text-sm text-gray-500 mt-2')
        tag_row = ui.row().classes('flex-wrap gap-2')
        count_label = ui.label().classes('text-sm text-gray-500')
        results_container = ui.column().classes('w-full gap-3')

    def matches(row):
        text = f"{row['name']} {row['department']} {row['tags']}".lower()
        if search.value and search.value.lower() not in text:
            return False
        if selected_tags:
            row_tags = set(str(row['tags']).split(';'))
            if not selected_tags.issubset(row_tags):
                return False
        return True

    def render_results():
        results_container.clear()
        df = load_profiles()
        filtered = df[df.apply(matches, axis=1)]
        count_label.set_text(f"{len(filtered)} students found")
        with results_container:
            for _, profile in filtered.iterrows():
                with ui.card().classes('w-full'):
                    with ui.row().classes('items-center gap-3'):
                        ui.avatar(icon='person', color=PRIMARY_RED, text_color='white')
                        with ui.column().classes('gap-0'):
                            ui.label(profile['name']).classes('font-bold text-lg')
                            ui.label(f"{profile['year']} · {profile['department']}").classes('text-gray-500 text-sm')
                    ui.label(profile['bio']).classes('text-sm mt-2')
                    with ui.row().classes('flex-wrap gap-1 mt-2'):
                        for tag in str(profile['tags']).split(';'):
                            ui.badge(tag).style(f'background-color: {PRIMARY_RED}20; color: {PRIMARY_RED};')
                    with ui.row().classes('w-full gap-2 mt-3'):
                        ui.button('Connect').props('rounded').style(
                            f'background-color: {PRIMARY_RED}; color: white;'
                        ).classes('flex-grow')
                        ui.button('Message').props('outline rounded').classes('flex-grow')

    def toggle_tag(tag, btn):
        if tag in selected_tags:
            selected_tags.discard(tag)
            btn.props('outline')
        else:
            selected_tags.add(tag)
            btn.props(remove='outline')
        render_results()

    with tag_row:
        for tag in all_tags:
            btn = ui.button(tag).props('outline rounded-full dense')
            btn.on_click(lambda t=tag, b=btn: toggle_tag(t, b))

    search.on('keydown.enter', render_results)
    search.on('blur', render_results)
    render_results()

ui.run(title='LSE Connect', port=8080)