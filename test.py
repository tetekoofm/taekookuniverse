from google.oauth2 import service_account
from googleapiclient.discovery import build

# ==== CONFIG ====
SERVICE_ACCOUNT_FILE = "/Users/haripriyakrishnan/Downloads/Python/tokens/tku.json"
FOLDER_ID = "PASTE_FOLDER_ID_HERE"  # e.g., calvin_klein_oct2025 folder ID

SCOPES = ['https://www.googleapis.com/auth/drive.readonly']

# ==== Authenticate ====
creds = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE, scopes=SCOPES
)
service = build('drive', 'v3', credentials=creds)

# ==== List all files in the folder ====
def list_files_in_folder(folder_id):
    files_list = []
    page_token = None

    while True:
        results = service.files().list(
            q=f"'{folder_id}' in parents and trashed=false",
            fields="nextPageToken, files(id, name)",
            pageToken=page_token
        ).execute()

        for f in results.get('files', []):
            # Format: name|ID
            files_list.append(f"{f['name']}|{f['id']}")

        page_token = results.get('nextPageToken', None)
        if page_token is None:
            break

    return files_list

files = list_files_in_folder(FOLDER_ID)
# Convert to comma-separated list of IDs only
ids_csv = ",".join([f.split("|")[1] for f in files])

print("Files and IDs (name|id):")
for f in files:
    print(f)
print("\nComma-separated IDs for Excel:")
print(ids_csv)
