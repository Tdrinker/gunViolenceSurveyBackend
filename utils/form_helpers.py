from typing import Dict, Tuple, Any
from utils.const import STUDENT_ID, CONSENT_AGREED


def validate_sona_form(form: Dict[str, Any]) -> Tuple[bool, str]:
    if STUDENT_ID not in form:
        return False, "expected Student Id in form"

    if not is_valid_student_id(form[STUDENT_ID]):
        return False, "Invalid Student Id"

    return True, ""


def validate_sona_consent_form(form: Dict[str, Any]) -> Tuple[bool, str]:
    if CONSENT_AGREED not in form or not form[CONSENT_AGREED]:
        return False, "please agree the consent"

    return True, ""


def is_valid_student_id(student_id: str) -> bool:
    return len(student_id) == 10 and student_id.isdigit()


def is_valid_name(name: str) -> bool:
    return len(name) > 0 and name.isalpha()
