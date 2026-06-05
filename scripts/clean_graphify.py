import os
import shutil
import re

def main():
    # Target graphify-out relative to the repository root
    base_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'graphify-out')
    if not os.path.exists(base_dir):
        print("graphify-out directory not found.")
        return

    # Match YYYY-MM-DD or YYYY-MM-DD_X
    pattern = re.compile(r'^\d{4}-\d{2}-\d{2}(_\d+)?$')
    
    dirs = []
    for item in os.listdir(base_dir):
        item_path = os.path.join(base_dir, item)
        if os.path.isdir(item_path) and pattern.match(item):
            dirs.append(item)

    if not dirs:
        print("No dated backup directories found.")
        return

    # Helper to sort by date and sequence suffix integer
    def sort_key(name):
        parts = name.split('_')
        date_part = parts[0]
        suffix = int(parts[1]) if len(parts) > 1 else 0
        return (date_part, suffix)

    dirs.sort(key=sort_key)
    
    latest = dirs[-1]
    to_delete = dirs[:-1]
    
    print(f"Keeping latest backup: {latest}")
    print(f"Cleaning {len(to_delete)} older backup directories...")

    for d in to_delete:
        path = os.path.join(base_dir, d)
        try:
            shutil.rmtree(path)
        except Exception as e:
            print(f"Failed to delete {d}: {e}")
            
    print("Cleanup completed.")

if __name__ == '__main__':
    main()
