import * as pg from "pg";

import {createConfig} from "../config/pgconfig";

const pool = new pg.Pool(createConfig());
export const pgpool = {
  pool: pool
};

