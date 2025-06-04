from datetime import datetime, timezone, timedelta


def utc_now_timestamp() -> float:
    return datetime.now(timezone.utc).replace(microsecond=0).timestamp()


def todays_first_timestamp() -> float:
    return datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0).timestamp()


def timedelta_from_now_timestamp(
    days: float = 0, 
    seconds: float = 0, 
    microseconds: float = 0,     
    milliseconds: float = 0, 
    minutes: float = 0, 
    hours: float = 0, 
    weeks: float = 0, 
) -> float:

    return (
        datetime.now(timezone.utc).replace(microsecond=0) + 
        timedelta(
            days=days, 
            seconds=seconds, 
            microseconds=microseconds,     
            milliseconds=milliseconds, 
            minutes=minutes, 
            hours=hours, 
            weeks=weeks
        )
    ).timestamp()


def timestamp_to_date_str(timestamp: float) -> str:
    return datetime.fromtimestamp(timestamp).strftime("%d.%m.%Y")