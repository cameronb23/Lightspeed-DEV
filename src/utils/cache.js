// @flow
import nw from 'nw.gui';
import fs from 'fs';
import path from 'path';
import _ from 'underscore';
// import storage from 'electron-json-storage';

import type { CheckoutProfile, AppSettings } from '../globals';

const PROFILE_PATH = path.join(nw.App.dataPath, 'profiles.json');
const SETTINGS_PATH = path.join(nw.App.dataPath, 'settings.json');

class CacheException extends Error {
  constructor(errorMessage: string) {
    super(errorMessage);

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, CacheException);
  }
}

export const loadProfiles = (silent: boolean = false) => {
  if (!silent) {
    console.log('[INTERNAL] Loading profiles from cache.');
    console.log('[INTERNAL] Internal cache location: ', nw.App.dataPath);
  }

  return new Promise((resolve, reject) => {
    fs.readFile(PROFILE_PATH, (err, data) => {
      if (err) {
        return reject(new CacheException(err));
      }

      try {
        const json = JSON.parse(data);

        return resolve(json);
      } catch (e) {
        return reject(new CacheException(e));
      }
    });
  });
};

export const saveProfiles = (profiles: Array<CheckoutProfile>, silent: boolean = false) => {
  console.log('[INTERNAL] Saving profiles to cache.');

  return new Promise((resolve, reject) => {
    const json = JSON.stringify(profiles);
    fs.writeFile(PROFILE_PATH, json, (err) => {
      if (err) {
        return reject(new CacheException(err));
      }

      if (!silent) {
        console.log('[INTERNAL] Profiles saved to cache');
      }

      return resolve();
    });
  });
};

export const removeProfile = (id: string) => {
  console.log(`[INTERNAL] Removing profile with id '${id}'`);

  return new Promise(async (resolve, reject) => {
    // fetch current cache

    try {
      const profiles = await loadProfiles(true);

      const prof = _.findWhere(profiles, { id });
      const newProfiles = _.without(profiles, prof);

      await saveProfiles(newProfiles, true);

      console.log('[INTERNAL] New profile data saved to cache');
      return resolve();
    } catch (e) {
      return reject(new CacheException(e));
    }
  });
};


// App settings
export const loadSettings = () => {
  console.log('[INTERNAL] Loading app settings from cache.');

  return new Promise((resolve, reject) => {
    fs.readFile(SETTINGS_PATH, (err, data) => {
      if (err) {
        return reject(new CacheException(err));
      }

      try {
        const json = JSON.parse(data);

        return resolve(json);
      } catch (e) {
        return reject(new CacheException(e));
      }
    });
  });
};

export const saveSettings = (appSettings: AppSettings) => {
  console.log('[INTERNAL] Saving app settings to cache.');

  return new Promise((resolve, reject) => {
    const json = JSON.stringify(appSettings);
    fs.writeFile(SETTINGS_PATH, json, (err) => {
      if (err) {
        return reject(new CacheException(err));
      }

      console.log('[INTERNAL] Settings saved to cache');

      return resolve();
    });
  });
};
