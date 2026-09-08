"""
PALASH Centralized Language Configuration & Registry.
Stage 2.12 - Multilingual Curriculum Data Architecture.

Extensible registry for supported curriculum languages:
Hindi (hi), Ho (ho), Mundari (mun), Santhali (sat).
"""
from typing import List, Dict, Optional
from pydantic import BaseModel


class LanguageConfig(BaseModel):
    code: str
    name: str
    native_name: str
    script: str
    is_active: bool = True
    direction: str = "ltr"


SUPPORTED_LANGUAGES: List[LanguageConfig] = [
    LanguageConfig(
        code="hi",
        name="Hindi",
        native_name="हिन्दी",
        script="Devanagari",
        is_active=True,
    ),
    LanguageConfig(
        code="ho",
        name="Ho",
        native_name="Warang Chiti / Ho",
        script="Warang Chiti / Devanagari",
        is_active=True,
    ),
    LanguageConfig(
        code="mun",
        name="Mundari",
        native_name="Mundari Bani / Mundari",
        script="Mundari Bani / Devanagari",
        is_active=True,
    ),
    LanguageConfig(
        code="sat",
        name="Santhali",
        native_name="Ol Chiki / Santhali",
        script="Ol Chiki",
        is_active=True,
    ),
]

SUPPORTED_LANGUAGE_CODES = {lang.code for lang in SUPPORTED_LANGUAGES}


def get_supported_languages(only_active: bool = True) -> List[LanguageConfig]:
    """Return configured supported languages."""
    if only_active:
        return [l for l in SUPPORTED_LANGUAGES if l.is_active]
    return list(SUPPORTED_LANGUAGES)


def get_language_by_code(code: str) -> Optional[LanguageConfig]:
    """Get language configuration by code."""
    code_lower = code.lower().strip()
    for lang in SUPPORTED_LANGUAGES:
        if lang.code == code_lower:
            return lang
    return None
