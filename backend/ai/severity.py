def get_severity(disease):
    high = ["MEL", "SCC"]
    medium = ["BCC", "AK"]
    low = ["NV", "BKL", "DF", "VASC"]

    if disease in high:
        return "High", "Immediate"

    if disease in medium:
        return "Moderate", "Within 3 Days"

    return "Low", "Routine"
