from datetime import datetime, timezone, timedelta


def utc_now_timestamp() -> float:
    return datetime.now(timezone.utc).replace(microsecond=0).timestamp()


def todays_first_timestamp() -> float:
    return datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0).timestamp()


def timedelta_from_now_timestamp(
    days=0, 
    seconds=0, 
    microseconds=0,     
    milliseconds=0, 
    minutes=0, 
    hours=0, 
    weeks=0
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