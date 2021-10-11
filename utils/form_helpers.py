from typing import Dict, Tuple, Any


def validate_sona_form(form: Dict[str, Any]) -> Tuple[bool, str]:
    if "studentId" not in form:
        return False, "expected Student Id in form"
    if "firstName" not in form:
        return False, "expected First Name in form"
    if "lastName" not in form:
        return False, "expected Last Name in form"

    if not is_valid_student_id(form["studentId"]):
        return False, "Invalid Student Id"
    if not is_valid_name(form["firstName"]):
        return False, "Invalid First Name"
    if not is_valid_name(form["lastName"]):
        return False, "Invalid Last Name"

    return True, ""


def is_valid_student_id(student_id: str) -> bool:
    return len(student_id) == 10 and student_id.isdigit()


def is_valid_name(name: str) -> bool:
    return len(name) > 0 and name.isalpha()
