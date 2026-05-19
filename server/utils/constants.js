const ROLES = {
  EMPLOYER: 'employer',
  JOB_SEEKER: 'job_seeker',
};

const JOB_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed',
  DRAFT: 'draft',
};

const APPLICATION_STATUS = {
  PENDING: 'pending',
  REVIEWED: 'reviewed',
  SHORTLISTED: 'shortlisted',
  REJECTED: 'rejected',
  ACCEPTED: 'accepted',
};

const JOB_TYPES = {
  FULL_TIME: 'full-time',
  PART_TIME: 'part-time',
  CONTRACT: 'contract',
  INTERNSHIP: 'internship',
  REMOTE: 'remote',
};

const EXPERIENCE_LEVELS = {
  ENTRY: 'entry',
  MID: 'mid',
  SENIOR: 'senior',
  LEAD: 'lead',
};

module.exports = {
  ROLES,
  JOB_STATUS,
  APPLICATION_STATUS,
  JOB_TYPES,
  EXPERIENCE_LEVELS,
};
