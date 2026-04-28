def get_treatment(disease):
    rules = {
        "MEL": [
            "Urgent dermatologist consultation",
            "Biopsy may be required",
            "Avoid delay"
        ],
        "BCC": [
            "Consult dermatologist in 3 days",
            "Cryotherapy may help",
            "Avoid sun exposure"
        ],
        "AK": [
            "Skin specialist review recommended",
            "Use sunscreen",
            "Monitor lesion changes"
        ],
        "SCC": [
            "Immediate clinical review",
            "Possible excision required"
        ],
        "NV": [
            "Usually benign",
            "Monitor size/color changes"
        ],
        "BKL": [
            "Usually non-cancerous",
            "Routine skin review if irritated"
        ],
        "DF": [
            "Generally harmless",
            "No urgent treatment needed"
        ],
        "VASC": [
            "Vascular lesion",
            "Routine consultation if bleeding"
        ]
    }

    return rules.get(disease, ["Consult doctor"])
