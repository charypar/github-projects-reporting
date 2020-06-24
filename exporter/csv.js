function format(value) {
  if (value instanceof Date) {
    return `${value.getFullYear()}/${
      value.getMonth() + 1
    }/${value.getDate()} ${value.getHours()}:${value
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  }

  if (Array.isArray(value)) {
    return value.join("|");
  } else {
    return (value && value.toString()) || "";
  }
}

function printLn(values) {
  return values.map((v) => `"${v.replace(/"/g, '\\"')}"`).join(",") + "\n";
}

exports.formatFile = function (events, writeFn) {
  const keys = Object.keys(events[0]);

  writeFn(printLn(keys));

  events.forEach((event) => {
    const values = keys.map((key) => format(event[key]));
    writeFn(printLn(values));
  });
};
