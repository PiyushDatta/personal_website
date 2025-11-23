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
# HELPERS
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

def clean_text(text):
    """Removes bullet characters and extra whitespace."""
    text = re.sub(r'^[•\-\u2022\u2023\u25E6\u2043\u2219]\s*', '', text)
    return text.strip()

def escape_js(text):
    """Escapes single quotes for JS strings and removes tabs."""
    if not text: return ""
    # Remove all tabs and normalize whitespace
    text = re.sub(r'\t', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    # Escape single quotes
    return text.replace("'", "\\'")

def is_italic(run):
    """Check if a run is italic."""
    return run.italic or (run.font.italic if run.font else False)

def is_bold(run):
    """Check if a run is bold."""
    return run.bold or (run.font.bold if run.font else False)

def parse_date_range(text):
    """
    Extracts date range from text like 'April 2022 -- Present' or 'June 2020 -- April 2022'
    Returns (start_date, end_date) tuple
    """
    # Clean tabs and extra whitespace first
    text = re.sub(r'\t', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    
    date_pattern = r'([A-Za-z]+\s+\d{4})\s*(?:--|-|–)\s*([A-Za-z]+\s+\d{4}|Present)'
    match = re.search(date_pattern, text)
    if match:
        start = match.group(1)
        end = match.group(2) if match.group(2) != 'Present' else None
        return start, end
    return None, None

def extract_position_info(para):
    """
    Extracts position title from italic text in paragraph.
    Returns position title or None.
    """
    position = ""
    for run in para.runs:
        if is_italic(run):
            position += run.text
    return position.strip() if position else None

def is_project_title(text, para):
    """
    Determines if a line is a project title based on:
    1. Contains specific project keywords
    2. Has bold formatting
    3. Not a bullet point
    4. Not just a section header like "Website:"
    """
    # Skip header-only lines
    if text.strip().endswith(':') and len(text.strip()) < 20:
        return False
    
    # Skip bullet points
    if text.startswith(('•', '-')):
        return False
    
    # Project title indicators
    project_keywords = [
        'Hackathon', 'Competition', 'patent', 'TensorFlow', 
        'Two Sigma', 'DattaBot', 'LLM', 'Open-source Project',
        'Google Brain', 'StrongCompute'
    ]
    
    # Check if text contains project keywords
    has_keyword = any(keyword in text for keyword in project_keywords)
    
    # Check if paragraph has bold text
    has_bold = any(is_bold(run) for run in para.runs)
    
    return has_keyword and has_bold

# ==========================================
# PARSER
# ==========================================
def parse_resume(file_path):
    doc = Document(file_path)
    rels = get_document_hyperlinks(doc)
    
    work_entries = []
    project_entries = []
    
    current_section = None
    current_obj = None
    in_work_section = False
    
    for i, para in enumerate(doc.paragraphs):
        text = para.text.strip()
        if not text:
            continue

        # Check if this looks like a company name (bold text with location)
        is_bold_line = any(is_bold(run) for run in para.runs) and not any(is_italic(run) for run in para.runs)
        # More flexible location pattern
        has_location = re.search(r'[,\s\t]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*[,\s\t]+[A-Z]{2}|[A-Z]{2})(?:\s|$)', text)
        
        # Detect Work Experience section
        if is_bold_line and has_location and not text.startswith(('•', '-')):
            # Skip if this looks like a "Technologies", "University", or "Concepts" line
            if any(skip_word in text for skip_word in ['Technologies', 'Concepts', 'University']):
                continue
                
            # This is likely a company name
            if current_obj:
                if current_section == 'WORK': 
                    work_entries.append(current_obj)
                elif current_section == 'PROJECT': 
                    project_entries.append(current_obj)
            
            current_section = 'WORK'
            in_work_section = True
            
            # Extract company name and location
            # First normalize whitespace (tabs to spaces)
            cleaned_text = re.sub(r'\t+', ' ', text)
            cleaned_text = re.sub(r'\s+', ' ', cleaned_text).strip()
            
            # Try to match against known company names first
            company_name = ""
            location = ""
            
            for known_company in COMPANY_URLS.keys():
                if cleaned_text.startswith(known_company):
                    company_name = known_company
                    # Everything after the company name is the location
                    remainder = cleaned_text[len(known_company):].strip()
                    # Remove leading comma or whitespace
                    location = remainder.lstrip(',').strip()
                    break
            
            # If no match, fall back to splitting by comma or multiple spaces
            if not company_name:
                if ',' in cleaned_text:
                    parts = cleaned_text.split(',', 1)
                    company_name = parts[0].strip()
                    if len(parts) > 1:
                        location = parts[1].strip()
                else:
                    # Split by 2+ spaces
                    parts = re.split(r'\s{2,}', cleaned_text, 1)
                    company_name = parts[0].strip() if parts else cleaned_text.strip()
                    if len(parts) > 1:
                        location = parts[1].strip()
            
            current_obj = {
                "name": company_name,
                "position": "",
                "url": COMPANY_URLS.get(company_name, ""),
                "startDate": "",
                "endDate": None,
                "location": location,
                "highlights": []
            }
            continue
        
        # Check for position title (italic text) in work section
        if current_section == 'WORK' and current_obj:
            position = extract_position_info(para)
            if position:
                # Check if dates are on same line
                start, end = parse_date_range(text)
                if start:
                    current_obj['position'] = position
                    current_obj['startDate'] = start
                    current_obj['endDate'] = end
                else:
                    current_obj['position'] = position
                continue
            
            # Check for date range on its own line
            start, end = parse_date_range(text)
            if start and current_obj['startDate'] == "":
                current_obj['startDate'] = start
                current_obj['endDate'] = end
                continue
        
        # Detect project titles
        if is_project_title(text, para):
            # Save previous object
            if current_obj:
                if current_section == 'WORK': 
                    work_entries.append(current_obj)
                elif current_section == 'PROJECT': 
                    project_entries.append(current_obj)
            
            current_section = 'PROJECT'
            in_work_section = False
            
            # Extract link
            link = get_paragraph_link(para, rels)
            
            # Clean title (remove link text if embedded)
            title = text.split('http')[0].strip()
            
            current_obj = {
                "projectname": title,
                "link": link,
                "tech": "",
                "points": []
            }
            continue
        
        # Content parsing for current section
        if current_obj:
            is_list_style = para.style.name.startswith('List')
            is_visual_bullet = text.startswith('•') or text.startswith('-')
            
            if is_list_style or is_visual_bullet:
                clean_point = clean_text(text)
                if current_section == 'WORK':
                    current_obj['highlights'].append(clean_point)
                elif current_section == 'PROJECT':
                    current_obj['points'].append(clean_point)
            
            # Tech stack detection for projects (italic text that's not a bullet)
            elif current_section == 'PROJECT' and current_obj['tech'] == "":
                tech_text = ""
                for run in para.runs:
                    if is_italic(run):
                        tech_text += run.text
                
                if tech_text.strip():
                    current_obj['tech'] = tech_text.strip()
    
    # Append final object
    if current_obj:
        if current_section == 'WORK': 
            work_entries.append(current_obj)
        elif current_section == 'PROJECT': 
            project_entries.append(current_obj)

    return work_entries, project_entries

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