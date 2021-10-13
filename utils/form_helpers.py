from typing import Dict, Tuple, Any
from utils.const import STUDENT_ID, FIRST_NAME, LAST_NAME


def validate_sona_form(form: Dict[str, Any]) -> Tuple[bool, str]:
    if STUDENT_ID not in form:
        return False, "expected Student Id in form"
    if FIRST_NAME not in form:
        return False, "expected First Name in form"
    if LAST_NAME not in form:
        return False, "expected Last Name in form"

    if not is_valid_student_id(form[STUDENT_ID]):
        return False, "Invalid Student Id"
    if not is_valid_name(form[FIRST_NAME]):
        return False, "Invalid First Name"
    if not is_valid_name(form[LAST_NAME]):
        return False, "Invalid Last Name"

    return True, ""


def is_valid_student_id(student_id: str) -> bool:
    return len(student_id) == 10 and student_id.isdigit()


def is_valid_name(name: str) -> bool:
    return len(name) > 0 and name.isalpha()
