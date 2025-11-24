import re
import os
import sys
import docx
from docx import Document
from docx.opc.constants import RELATIONSHIP_TYPE as RT
import pathlib
from datetime import datetime

# ==========================================
# CONFIGURATION
# ==========================================
CURRENT_FILE_PATH_OBJ = pathlib.Path(__file__)
print(f"File name current python file: {CURRENT_FILE_PATH_OBJ}")
ABSOLUTE_FILE_PATH = CURRENT_FILE_PATH_OBJ.resolve()
CURRENT_DIRECTORY_PATHLIB = ABSOLUTE_FILE_PATH.parent
print(f"Directory of current python file: {CURRENT_DIRECTORY_PATHLIB}")
DOC_PATH = CURRENT_DIRECTORY_PATHLIB.joinpath("public", "resumes", "piyush_datta_resume.docx")
WORK_OUTPUT_PATH = CURRENT_DIRECTORY_PATHLIB.joinpath("src", "data", "resume", "work.js")
PROJECT_OUTPUT_PATH = CURRENT_DIRECTORY_PATHLIB.joinpath("src", "data", "resume", "resumeprojects.js")

# Known URLs to map if they aren't explicit links in the text
COMPANY_URLS = {
    "Amazon Web Services": "https://aws.amazon.com/",
    "Givex": "https://www.givex.com/",
    "Meta": "https://meta.com/",
}

# ==========================================
# HELPERS - Text Utilities
# ==========================================
def clean_text(text):
    """Removes bullet characters and extra whitespace."""
    # Remove various bullet point characters
    text = re.sub(r'^[•\-\*\u2022\u2023\u25E6\u2043\u2219\u00B7·]\s*', '', text)
    return text.strip()

def normalize_whitespace(text):
    """Normalizes tabs and multiple spaces to single spaces."""
    text = re.sub(r'\t', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def escape_js(text):
    """Escapes single quotes for JS strings and removes tabs."""
    if not text: 
        return ""
    text = normalize_whitespace(text)
    return text.replace("'", "\\'")

# ==========================================
# HELPERS - Document Analysis
# ==========================================
def get_document_hyperlinks(doc):
    """
    Extracts all hyperlinks from the document using the relationship table.
    Returns a dictionary mapping {r_id: url}.
    """
    rels = doc.part.rels
    hyperlinks = {}
    for rel in rels.values():
        if rel.reltype == RT.HYPERLINK:
            hyperlinks[rel.rId] = rel.target_ref
    return hyperlinks

def get_paragraph_link(para, doc_rels):
    """
    Checks if a paragraph contains a hyperlink by looking for 'hyperlink' xml tags
    and matching them to the relationship ID.
    """
    try:
        xml = para._p.xml
        ids = re.findall(r'w:hyperlink[^>]*r:id="([^"]+)"', xml)
        for rid in ids:
            if rid in doc_rels:
                return doc_rels[rid]
    except Exception:
        pass
        
    text = para.text.strip()
    url_match = re.search(r'(https?://[^\s]+)', text)
    if url_match:
        return url_match.group(1)
        
    return ""

def is_italic(run):
    """Check if a run is italic."""
    return run.italic or (run.font.italic if run.font else False)

def is_bold(run):
    """Check if a run is bold."""
    return run.bold or (run.font.bold if run.font else False)

def has_bold_text(para):
    """Check if paragraph contains any bold text."""
    return any(is_bold(run) for run in para.runs)

def has_italic_text(para):
    """Check if paragraph contains any italic text."""
    return any(is_italic(run) for run in para.runs)

def extract_italic_text(para):
    """Extract all italic text from a paragraph."""
    italic_text = ""
    for run in para.runs:
        if is_italic(run):
            italic_text += run.text
    return italic_text.strip()

# ==========================================
# HELPERS - Pattern Matching
# ==========================================
def parse_date_range(text):
    """
    Extracts date range from text like 'April 2022 -- Present' or 'June 2020 -- April 2022'
    Returns (start_date, end_date) tuple
    """
    text = normalize_whitespace(text)
    
    # Try multiple date patterns
    patterns = [
        # Year only: 2020 -- 2025 or 2025 -- Present
        r'(\d{4})\s*(?:--|-|–)\s*(\d{4}|Present)',
        # Full date: January 2020 -- April 2022
        r'([A-Za-z]+\s+\d{4})\s*(?:--|-|–)\s*([A-Za-z]+\s+\d{4}|Present)',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            start = match.group(1)
            end = match.group(2) if match.group(2) != 'Present' else None
            return start, end
    
    return None, None

def is_company_line(text, para):
    """
    Determines if a line is a company name based on:
    1. Matches one of the known company names from COMPANY_URLS
    2. Has bold formatting
    3. Contains a location (city, state)
    4. Not a bullet point
    """
    # Normalize text
    text = normalize_whitespace(text)
    
    # Skip bullets (including middle dot ·)
    if re.match(r'^[•\-\*\u2022\u2023\u25E6\u2043\u2219\u00B7·]\s', text):
        return False
    
    # Must have bold text
    if not has_bold_text(para):
        return False
    
    # Must NOT have italic text (positions are italic)
    if has_italic_text(para):
        return False
    
    # CRITICAL: Must start with a known company name
    starts_with_known_company = any(
        text.startswith(company) for company in COMPANY_URLS.keys()
    )
    
    if not starts_with_known_company:
        return False
    
    # Should have a location pattern (City, State or State abbreviation)
    has_location = re.search(r'[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z]{2}', text)
    
    return has_location is not None

def is_position_line(text, para):
    """
    Determines if a line contains a position title.
    Position lines have italic text and typically include dates.
    They should NOT be bullet points.
    """
    # If it's a bullet point, it's not a position line
    if is_bullet_point(text, para):
        return False
    
    return has_italic_text(para)

def is_project_line(text, para):
    """
    Determines if a line is a project title based on:
    1. Has bold formatting
    2. Contains project keywords OR has a pattern like "1st Place"
    3. Not a bullet point
    """
    text = normalize_whitespace(text)
    
    # Skip bullets (including middle dot ·)
    if re.match(r'^[•\-\*\u2022\u2023\u25E6\u2043\u2219\u00B7·]\s', text):
        return False
    
    # Skip section headers that end with colon
    if text.endswith(':') and len(text) < 30:
        return False
    
    # Must have bold text
    if not has_bold_text(para):
        return False
    
    # Skip if it's one of the known companies (more specific check)
    if any(text.startswith(company) for company in COMPANY_URLS.keys()):
        return False
    
    # Project indicators
    project_indicators = [
        'Place', 'Hackathon', 'Competition', 'Patent', 'Prize',
        'TensorFlow', 'Contributor', 'Open-source', 'Open-Source',
        'Google Brain', 'StrongCompute', 'Award', 'Champion', 'Novice',
        'Winner', 'Finalist'
    ]
    
    return any(indicator in text for indicator in project_indicators)

def is_bullet_point(text, para):
    """Check if a line is a bullet point."""
    if para.style.name.startswith('List'):
        return True
    # Check for various bullet characters including middle dot (·)
    return bool(re.match(r'^[•\-\*\u2022\u2023\u25E6\u2043\u2219\u00B7·]\s', text))

# ==========================================
# PARSER - Company Extraction
# ==========================================
def extract_company_info(text):
    """
    Extracts company name and location from a company line.
    Expected format: "Company Name    City, State" or "Company Name, City, State"
    """
    text = normalize_whitespace(text)
    
    # Try to match against known companies first
    for known_company in COMPANY_URLS.keys():
        if text.startswith(known_company):
            company_name = known_company
            remainder = text[len(known_company):].strip()
            location = remainder.lstrip(',').strip()
            return company_name, location
    
    # Fallback: split by comma or multiple spaces
    if ',' in text:
        parts = text.split(',', 1)
        company_name = parts[0].strip()
        location = parts[1].strip() if len(parts) > 1 else ""
    else:
        parts = re.split(r'\s{2,}', text, 1)
        company_name = parts[0].strip()
        location = parts[1].strip() if len(parts) > 1 else ""
    
    return company_name, location

def create_work_entry(company_name, location):
    """Creates a new work experience entry."""
    return {
        "name": company_name,
        "position": "",
        "url": COMPANY_URLS.get(company_name, ""),
        "startDate": "",
        "endDate": None,
        "location": location,
        "highlights": []
    }

# ==========================================
# PARSER - Position Extraction
# ==========================================
def extract_position_and_dates(text, para):
    """
    Extracts position title and date range from a position line.
    Expected format: "Position Title    2020 -- 2025"
    Returns: (position, start_date, end_date)
    """
    text = normalize_whitespace(text)
    
    # Extract italic text as position
    position = extract_italic_text(para)
    
    # Extract dates
    start_date, end_date = parse_date_range(text)
    
    return position, start_date, end_date

# ==========================================
# PARSER - Project Extraction
# ==========================================
def extract_project_info(text, para, doc_rels):
    """
    Extracts project title and link from a project line.
    Returns: (title, link)
    """
    text = normalize_whitespace(text)
    
    # Get link if exists
    link = get_paragraph_link(para, doc_rels)
    
    # Clean title (remove URLs if embedded)
    title = text.split('http')[0].strip()
    
    return title, link

def create_project_entry(title, link):
    """Creates a new project entry."""
    return {
        "projectname": title,
        "link": link,
        "tech": "",
        "points": []
    }

# ==========================================
# PARSER - Main Function (Refactored)
# ==========================================
def parse_resume(file_path):
    """
    Parses a resume document and extracts work experience and projects.
    """
    doc = Document(file_path)
    rels = get_document_hyperlinks(doc)
    
    work_entries = []
    project_entries = []
    
    current_section = None  # 'WORK' or 'PROJECT'
    current_entry = None
    
    for i, para in enumerate(doc.paragraphs):
        text = para.text.strip()
        if not text:
            continue
        
        # Check what type of line this is
        if is_company_line(text, para):
            # Save previous entry
            current_entry = save_current_entry(
                current_entry, current_section, work_entries, project_entries
            )
            
            # Start new work entry
            current_section = 'WORK'
            company_name, location = extract_company_info(text)
            current_entry = create_work_entry(company_name, location)
            
        elif is_position_line(text, para) and current_section == 'WORK':
            # Extract position and dates
            position, start_date, end_date = extract_position_and_dates(text, para)
            if current_entry and position:
                # Only update position if it's not already set (avoid overwriting)
                if not current_entry['position']:
                    current_entry['position'] = position
                if start_date and not current_entry['startDate']:
                    current_entry['startDate'] = start_date
                    current_entry['endDate'] = end_date
            
        elif is_project_line(text, para):
            # Save previous entry
            current_entry = save_current_entry(
                current_entry, current_section, work_entries, project_entries
            )
            
            # Start new project entry
            current_section = 'PROJECT'
            title, link = extract_project_info(text, para, rels)
            current_entry = create_project_entry(title, link)
            
        elif is_bullet_point(text, para):
            # Add to current entry
            if current_entry:
                clean_point = clean_text(text)
                if current_section == 'WORK':
                    current_entry['highlights'].append(clean_point)
                elif current_section == 'PROJECT':
                    current_entry['points'].append(clean_point)
        
        elif current_section == 'PROJECT' and current_entry:
            # Check for tech stack (italic text that's not a bullet)
            tech_text = extract_italic_text(para)
            if tech_text and not current_entry['tech']:
                current_entry['tech'] = tech_text
    
    # Save final entry
    save_current_entry(current_entry, current_section, work_entries, project_entries)
    
    return work_entries, project_entries

def save_current_entry(entry, section, work_entries, project_entries):
    """Saves the current entry to the appropriate list."""
    if entry:
        if section == 'WORK':
            work_entries.append(entry)
        elif section == 'PROJECT':
            project_entries.append(entry)
    return None

# ==========================================
# JS GENERATORS
# ==========================================
def generate_work_js(data):
    js = f"/**\n * generated by file: {os.path.basename(__file__)}\n */\n"
    
    js += "/**\n * @typedef {{Object}} Position\n * Conforms to https://jsonresume.org/schema/\n"
    js += " *\n * @property {{string}} name - Name of the company\n * @property {{string}} position - Position title\n"
    js += " * @property {{string}} url - Company website\n * @property {{string}} startDate - Start date of the position in YYYY-MM-DD format\n"
    js += " * @property {{string|undefined}} endDate - End date of the position in YYYY-MM-DD format.\n"
    js += " * If undefined, the position is still active.\n * @property {{string}} location - Location of workplace\n"
    js += " * @property {{string|undefined}} summary - html/markdown summary of the position\n"
    js += " * @property {{string[]}} highlights - plain text highlights of the position (bulleted list)\n */\n"
    
    js += "const work = [\n"
    for entry in data:
        js += "  {\n"
        js += f"    name: '{escape_js(entry['name'])}',\n"
        js += f"    position: '{escape_js(entry['position'])}',\n"
        js += f"    url: '{entry['url']}',\n"
        js += f"    startDate: '{entry['startDate']}',\n"
        if entry['endDate']:
            js += f"    endDate: '{entry['endDate']}',\n"
        js += f"    location: '{escape_js(entry.get('location', ''))}',\n"
        js += "    highlights: [\n"
        for h in entry['highlights']:
            js += f"      '{escape_js(h)}',\n"
        js += "    ],\n"
        js += "  },\n"
    js += "];\n\nexport default work;"
    return js

def generate_projects_js(data):
    js = f"/**\n * generated by file: {os.path.basename(__file__)}\n */\n"
    
    js += "const resumeProjects = [\n"
    for entry in data:
        js += "  {\n"
        js += f"    projectname: '{escape_js(entry['projectname'])}',\n"
        js += f"    link: '{entry['link']}',\n"
        js += f"    tech: '{escape_js(entry['tech'])}',\n"
        js += "    points: [\n"
        for p in entry['points']:
            js += f"      '{escape_js(p)}',\n"
        js += "    ],\n"
        js += "  },\n"
    js += "];\n\nexport default resumeProjects;"
    return js

# ==========================================
# MAIN EXECUTION
# ==========================================
if __name__ == "__main__":
    if not os.path.exists(DOC_PATH):
        print(f"Error: {DOC_PATH} not found.")
        sys.exit(1)

    print(f"Reading {DOC_PATH}...")
    try:
        works, projects = parse_resume(DOC_PATH)
        
        print(f"\nExtracted {len(works)} work experience(s):")
        for work in works:
            print(f"  - {work['name']}: {work['position']} ({work['startDate']} - {work['endDate'] or 'Present'})")
        
        print(f"\nExtracted {len(projects)} project(s):")
        for proj in projects:
            print(f"  - {proj['projectname']}")
        
        # Generate Work JS
        work_js_content = generate_work_js(works)
        os.makedirs(os.path.dirname(WORK_OUTPUT_PATH), exist_ok=True)
        
        with open(WORK_OUTPUT_PATH, "w", encoding="utf-8") as f:
            f.write(work_js_content)
        print(f"\nGenerated: {WORK_OUTPUT_PATH}")

        # Generate Projects JS
        proj_js_content = generate_projects_js(projects)
        with open(PROJECT_OUTPUT_PATH, "w", encoding="utf-8") as f:
            f.write(proj_js_content)
        print(f"Generated: {PROJECT_OUTPUT_PATH}")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()