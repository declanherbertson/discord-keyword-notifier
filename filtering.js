export function filterKeywords(keywords, messageObjects) {
  return messageObjects.filter(obj => obj.messages.some(message => message.toLowerCase().includes(...keywords)))
}

export function filterUsers(users, messageObjects) {
  return messageObjects.filter(obj => !users.includes(obj.user));
}

export function filterTime(lastHandledTime, messageObjects) {
  if (!lastHandledTime) {
    return messageObjects;
  }
  const filterTime = _convertStringToTime(lastHandledTime)
  return messageObjects.filter(obj => _convertStringToTime(obj.time) > filterTime);
}

function _convertStringToTime(str) {
  const isPm = str.toLowerCase().includes('pm');
  let hour = parseInt(str.trim().split(':')[0]);
  const minute = parseInt(str.trim().split(':')[1].split(' ')[0]);
  if (isPm) {
    hour += 12;
  }
  const today = new Date();
  today.setHours(hour, minute, 0, 0);
  return today;
}

