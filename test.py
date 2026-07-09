import pandas as pd
from google.oauth2 import service_account
from googleapiclient.discovery import build

# ==== CONFIGURATION ====
EXCEL_FILE = "taekook_universe.xlsx"
SHEET_NAME = "Highlights"
HIGHLIGHTS_FOLDER_ID = "1eKHy2DuWlOpdcTe1MVEiAffwFTuq0rhu"  # your Highlights folder
SERVICE_ACCOUNT_FILE = "/Users/haripriyakrishnan/Downloads/Python/tokens/tku.json"

# ==== AUTHENTICATION ====
SCOPES = ['https://www.googleapis.com/auth/drive.readonly']
creds = service_account.Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
service = build('drive', 'v3', credentials=creds)

# ==== Load Excel ====
df = pd.read_excel(EXCEL_FILE, sheet_name=SHEET_NAME)

# ==== Helper to get folder ID by name and parent ====
def get_folder_id(folder_name, parent_id):
    query = f"name='{folder_name}' and '{parent_id}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false"
    results = service.files().list(q=query, fields="files(id, name)").execute()
    folders = results.get('files', [])
    if not folders:
        raise Exception(f"Folder not found: {folder_name} inside parent ID {parent_id}")
    return folders[0]['id']

# ==== Helper to get file ID + type ====
def get_file_id_with_type(file_name, parent_folder_id):
    query = f"name='{file_name}' and '{parent_folder_id}' in parents and trashed=false"
    results = service.files().list(q=query, fields="files(id, name, mimeType)").execute()
    files = results.get('files', [])
    if not files:
        print(f"File not found: {file_name}")
        return None
    f = files[0]
    media_type = 'video' if f['mimeType'].startswith('video') else 'image'
    return f"{f['id']}|{media_type}"

# ==== Map all files in Excel ====
def map_files_to_drive_ids(row):
    folder_name = row['folder']
    folder_id = get_folder_id(folder_name, HIGHLIGHTS_FOLDER_ID)
    files = [f.strip() for f in str(row['image']).split(',')]
    drive_ids = []
    for f in files:
        file_id_with_type = get_file_id_with_type(f, folder_id)
        if file_id_with_type:
            drive_ids.append(file_id_with_type)
    return ','.join(drive_ids)

df['image'] = df.apply(map_files_to_drive_ids, axis=1)

# ==== Save updated Excel ====
df.to_excel("highlights_drive_ids_with_type.xlsx", index=False)
print("Updated Excel saved: highlights_drive_ids_with_type.xlsx")
