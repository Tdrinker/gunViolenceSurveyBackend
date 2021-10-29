from typing import Dict, Tuple, Any
from utils.const import STUDENT_ID, CONSENT_AGREED, COUNTRY, IS_NATIVE, EDUCATION


def validate_sona_form(form: Dict[str, Any]) -> Tuple[bool, str]:
    if STUDENT_ID not in form:
        return False, "expected Student Id in form not found"

    if COUNTRY not in form:
        return False, "expected country in form not found"

    if IS_NATIVE not in form:
        return False, "expected answer for whether you are a native english speaker not found"

    if EDUCATION not in form:
        return False, "expected answer for highest education not found"

    if not is_valid_student_id(form[STUDENT_ID]):
        return False, "Invalid Student Id"

    if not is_valid_education(form[EDUCATION]):
        return False, "we require at least high school education to participate in this survey"

    if not is_valid_english_speaker((form[IS_NATIVE])):
        return False, "we require english speakers to participate in this survey"

    return True, ""


def validate_sona_consent_form(form: Dict[str, Any]) -> Tuple[bool, str]:
    if CONSENT_AGREED not in form or not form[CONSENT_AGREED]:
        return False, "please agree the consent"

    return True, ""


def is_valid_english_speaker(english: str) -> bool:
    return english == "native"


def is_valid_education(education: str) -> bool:
    return education != "below_high_school"


def is_valid_student_id(student_id: str) -> bool:
    return student_id.isdigit()
    # return len(student_id) == 10 and student_id.isdigit()


def is_valid_name(name: str) -> bool:
    return len(name) > 0 and name.isalpha()
