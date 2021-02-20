
function constructMessageObjects(messageLines) {
  const sentinalTest = /.*Today at \d\d?\:\d\d/;
  const partionedMessages = messageLines.reduce((acc, cur) => {
    if (sentinalTest.test(cur)) {
      acc.push([cur]);
    } else if (cur.toLowerCase().includes('wtb')){
      acc[acc.length - 1].push(cur);
    }
    return acc;
  }, []);
  return partionedMessages.map(partionedMessage => {
    return {
      user: partionedMessage[0].split('Today at ')[0],
      time: partionedMessage[0].split('Today at ')[1],
      messages: partionedMessage.slice(1)
    }
  });
}

export async function mapMessages(messages) {
  const messagesText = await Promise.all(messages.map(message => message.getText()));
  const messageLines = messagesText.flatMap(message => message.split('\n'));
  return constructMessageObjects(messageLines);
}