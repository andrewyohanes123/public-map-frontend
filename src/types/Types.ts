import ModelInstance from "@edgarjeremy/sirius.adapter/dist/libs/ModelInstance";

export interface Picture extends ModelInstance {
	description?: string;
  file: string;
  point_id?: number;
  user_id?: number;
	created_at?: Date;
	updated_at?: Date;
  point?: Point;
}

export interface Point extends ModelInstance {
	name: string;
  longitude: number;
  latitude: number;
  type_id?: number;
  user_id?: number;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
  pictures?: Picture[];
  user?: User;
}

export interface Type extends ModelInstance {
	name: string;
	icon: string;
  color: string;
	created_at?: Date;
	updated_at?: Date;
}

export interface User extends ModelInstance {
	name: string;
	username: string;
	password: string;
	type: 'Administrator' | 'Contributor';
	created_at?: Date;
	updated_at?: Date;
  points?: Point[];
  picutres?: Picture[];
}

export interface District {
  id: number;
  name: string;
  subdistricts: Subdistrict[];
}

export interface Subdistrict {
  id: number;
  name: string;
  neighbors: Neighbor[];
  district_id: number;
}

export interface Neighbor {
  id: number;
  name: string;
  subdistrict_id: number;
  district_id: number;
}

export interface Snapshot {
  [any: string]: any;
  name: string;
  id: number;
  visible: boolean;
  opacity: number;
  color: string;
}