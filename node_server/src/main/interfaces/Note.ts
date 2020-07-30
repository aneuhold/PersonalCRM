/**
 * Used to add on the Note interface to a schema.
 */
export const note = {
  notes: String,
};

/**
 * The type representing a document which contains notes in the database. This
 * can be implemented to make a document have notes. This is useful to make
 * an interface because this could become markdown later.
 */
export default interface Note {
  notes: string;
}
