import re
from pathlib import Path


INITIAL_DATA_DIR = Path(__file__).parent / 'migrations' / 'initial_data'


def get_initial_posts():
    initial_posts = []
    for image_path in INITIAL_DATA_DIR.iterdir():
        # image_001_When we launch the app at the beginning of our demo.gif
        title_match = re.fullmatch(r'image_\d+_(.*)\.gif$', image_path.name)

        if not title_match:
            continue

        title = title_match.groups()[0]

        initial_posts.append((title, image_path))

    return initial_posts
