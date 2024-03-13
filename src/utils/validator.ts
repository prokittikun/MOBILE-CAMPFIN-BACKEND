export class IsValidTime {
  validate(value: string) {
    const timeRegex = /^\d{2}:\d{2}$/;

    return typeof value === 'string' && timeRegex.test(value);
  }

  defaultMessage() {
    return 'Invalid time format. Please provide a valid time (hh:mm).';
  }
}

export class IsValidDate {
  validate(value: string) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    return typeof value === 'string' && dateRegex.test(value);
  }

  defaultMessage() {
    return 'Invalid date format. Please provide a valid date (YYYY-MM-DD).';
  }
}

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|PNG|JPG|JPEG)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};
