// Constants
const MINUTES_40_HOURS = 8 * 5 * 60;
const MINUTES_8_HOURS = 8 * 60; // 8 hours in minutes
const LUNCH_BREAK_MINUTES = 90; // 1.5 hours in minutes
const ESS_API_URL = process.env.NEXT_PUBLIC_TALENT_CLOUD_API_ENDPOINT;

const REPLACEMENT_HOURS = "Replacement Hours";
const AUTH_COOKIE_NAME = "auth_token"; // Cookie name for authentication token

const BASE_LOCATION = [3.1115281, 101.668227];

export {
  MINUTES_40_HOURS,
  MINUTES_8_HOURS,
  ESS_API_URL,
  LUNCH_BREAK_MINUTES,
  REPLACEMENT_HOURS,
  AUTH_COOKIE_NAME,
  BASE_LOCATION,
};
