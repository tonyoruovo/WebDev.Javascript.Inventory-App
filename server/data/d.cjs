/**
 * A validator for a given schema. Checks if the argument is in an acceptable format of a certain POJO in `T`` format.
 * @template T the type of format expected
 * @callback Validatable
 * @param {T} param the value to be checked.
 * @returns {boolean} `true` if the argument is valid, `false` if otherwise.
 */
/**
 * Gets a string message explaining why the check failed.
 * @template T the type to be validated
 * @callback Alertable
 * @param {{path: string, value: T}} param
 * @returns {string} The reason {@linkcode Validatable} return `false`
 */
/**
 * @template T the type that this value will validate
 * @typedef {Object} Validator
 * @property {Validatable<T>} validator the validation function
 * @property {Alertable<T>} message the error message
 */
/**
 * Write concern describes the level of acknowledgment requested from MongoDB for write operations to a standalone mongod or to
 * Replica sets or to sharded clusters. In sharded clusters, mongos instances will pass the write concern on to the shards.
 * see {@link https://www.mongodb.com/docs/manual/reference/write-concern/}
 * @typedef {Object} WriteConcern
 * @property {string} w requests acknowledgment that the write operation has propagated to a specified number of mongod instances
 * or to mongod instances with specified tags.\
 * \
 * @property {boolean} j requests acknowledgment from MongoDB that the write operation has been written to the on-disk journal.
 * @property {number} wtimeout specifies a time limit, in milliseconds, for the write concern. `wtimeout` is only applicable for `w` values greater
 * than `1`.
 */
/**
 * Options class for `toJson` and `toObject` properties in the `Schema` constructor.
 * @typedef {Object} JSObjectOptions
 * @property {boolean} [getters=false] if `true`, apply all getters, including virtuals
 * @property {boolean | {pathsToSkip: string[]}} [virtuals=false] if `true`, apply virtuals, including aliases. Use `{ getters: true, virtuals: false }` to just apply getters, not virtuals. An object of the form `{ pathsToSkip: ['someVirtual'] }` may also be used to omit specific virtuals.
 * @property {boolean} [aliases=true] if `true`, you can set `options.aliases = false` to skip applying aliases. This option is a no-op if `options.virtuals = false`.
 * @property {boolean} [minimize=true] if `true`, omit any empty objects from the output
 * @property {(doc: any, ret: any, options: MongooseSchemaOptions) => typeof ret} [transform=null] if `true`, omit any empty objects from the output
 * @property {boolean} [depopulate=false] if `true`, replace any conventionally populated paths with the original id in the output. Has no affect on virtual populated paths.
 * @property {boolean} [versionKey=true] if `false`, exclude the version key (`__v` by default) from the output
 * @property {boolean} [flattenMaps=false] if `true`, convert Maps to POJOs. Useful if you want to `JSON.stringify()` the result of `toObject()`.
 * @property {boolean} [flattenObjectIds=false] if `true`, convert any `ObjectIds` in the result to 24 character hex strings.
 * @property {boolean} [useProjection=false] If `true`, omits fields that are excluded in this document's projection. Unless you specified a projection, this will omit any field that has select: `false` in the schema.
 */
/**
 * When specifying collation, the locale field is mandatory; all other collation fields are optional. For descriptions of the fields, see
 * {@linkplain https://www.mongodb.com/docs/manual/reference/collation-locales-defaults/#std-label-collation-default-params Collation Document}.
 * Default collation parameter values vary depending on which locale you specify. For a complete list of default collation parameters and the locales they are associated with, see
 * @typedef {Object} CollationDoc
 * @property {string} locale
 * @property {boolean} caseLevel
 * @property {string} caseFirst
 * @property {int} strength
 * @property {boolean} numericOrdering
 * @property {string} alternate
 * @property {string} maxVariable
 * @property {boolean} backwards
 */
/**
 * @typedef {Object} MongooseSchemaOptions
 * @property {boolean} [autoIndex=false] By default, Mongoose's `init()` function creates all the indexes defined in your model's schema by
 * calling `Model.createIndexes()` after you successfully connect to MongoDB. Creating indexes automatically is great for
 * development and test environments. But index builds can also create significant load on your production database. If you want
 * to manage indexes carefully in production, you can set `autoIndex` to `false`.
 * ```js
 * const schema = new Schema(schemaObject, { autoIndex: false });
 * const Clock = mongoose.model('Clock', schema);
 * Clock.ensureIndexes(callback);
 * The autoIndex option is set to true by default. You can change this default by setting mongoose.set('autoIndex', false);
 * ```
 * @property {boolean} [autoCreate=true] Before Mongoose builds indexes, it calls `Model.createCollection()` to create the underlying
 * collection in MongoDB by default. Calling `createCollection()` sets the collection's default collation based on the collation
 * option and establishes the collection as a capped collection if you set the capped schema option. \
 * \
 * You can disable this behavior by setting `autoCreate` to `false` using `mongoose.set('autoCreate', false)`. Like `autoIndex`,
 * `autoCreate` is helpful for development and test environments, but you may want to disable it for production to avoid unnecessary
 * database calls.\
 * \
 * Unfortunately, `createCollection()` cannot change an existing collection. For example, if you add `capped: { size: 1024 }` to
 * your schema and the existing collection is not capped, `createCollection()` will not overwrite the existing collection. That is
 * because the MongoDB server does not allow changing a collection's options without dropping the collection first.
 * ```js
 * const schema = new Schema({ name: String }, {
 *   autoCreate: false,
 *   capped: { size: 1024 }
 * });
 * const Test = mongoose.model('Test', schema);
 * // No-op if collection already exists, even if the collection is not capped.
 * // This means that `capped` won't be applied if the 'tests' collection already exists.
 * await Test.createCollection();
 * ```
 * @property {boolean} [bufferCommands=true] By default, mongoose buffers commands when the connection goes down until the driver manages
 * to reconnect.
 * To disable buffering, set `bufferCommands` to `false`.
 * ```js
 * const schema = new Schema({ ... }, { bufferCommands: false });
 * ```
 * The schema `bufferCommands` option overrides the global `bufferCommands` option.
 * ```js
 * mongoose.set('bufferCommands', true);
 * // Schema option below overrides the above, if the schema option is set.
 * const schema = new Schema({ ... }, { bufferCommands: false });
 * ```
 * @property {number} [bufferTimeoutMS=10000] If `bufferCommands` is on, this option sets the maximum amount of time Mongoose buffering
 * will wait before throwing an error. If not specified, Mongoose will use `10000` (10 seconds).
 * ```js
 * // If an operation is buffered for more than 1 second, throw an error.
 * const schema = new Schema({ ... }, { bufferTimeoutMS: 1000 });
 * ```
 * @property {number} [capped=0] specifies the size of this collection on the db. The `capped` option may also be set to an object if
 * you want to pass additional options like `max`. In this case you must explicitly pass the `size` option, which is required.
 * ```js
 * new Schema({ ... }, { capped: { size: 1024, max: 1000, autoIndexId: true } });
 * ```
 * @property {string} [collection] Mongoose by default produces a `collection` name by passing the model name to the
 * `utils.toCollectionName` method. This method pluralizes the name. Set this option if you need a different name for your
 * collection.
 * ```js
 * const dataSchema = new Schema({ ... }, { collection: 'data' });
 * ```
 * @property {string} [discriminatorKey] When you define a `discriminator`, Mongoose adds a path to your schema that stores which
 * discriminator a document is an instance of. By default, Mongoose adds an `__t` path, but you can set `discriminatorKey` to
 * overwrite this default.
 * ```js
 * const baseSchema = new Schema({}, { discriminatorKey: 'type' });
 * const BaseModel = mongoose.model('Test', baseSchema);
 * const personSchema = new Schema({ name: String });
 * const PersonModel = BaseModel.discriminator('Person', personSchema);
 * const doc = new PersonModel({ name: 'James T. Kirk' });
 * // Without `discriminatorKey`, Mongoose would store the discriminator
 * // key in `__t` instead of `type`
 * doc.type; // 'Person'
 * ```
 * @property {boolean} [excludeIndexes=false] When `excludeIndexes` is `true`, Mongoose will not create indexes from the given
 * subdocument schema. This option only works when the schema is used in a subdocument path or document array path, Mongoose
 * ignores this option if set on the top-level schema for a model. Defaults to `false`.
 * ```js
 * const childSchema1 = Schema({
 *   name: { type: String, index: true }
 * });
 * const childSchema2 = Schema({
 *   name: { type: String, index: true }
 * }, { excludeIndexes: true });
 * // Mongoose will create an index on `child1.name`, but **not** `child2.name`, because `excludeIndexes`
 * // is true on `childSchema2`
 * const User = new Schema({
 *   name: { type: String, index: true },
 *   child1: childSchema1,
 *   child2: childSchema2
 * });
 * ```
 * @property {boolean} [id=true] Mongoose assigns each of your schemas an id virtual getter by default which returns the document's `_id`
 * field cast to a string, or in the case of `ObjectIds`, its `hexString`. If you don't want an id getter added to your schema, you
 * may disable it by passing this option at schema construction time.
 * ```js
 * // default behavior
 * const schema = new Schema({ name: String });
 * const Page = mongoose.model('Page', schema);
 * const p = new Page({ name: 'mongodb.org' });
 * console.log(p.id); // '50341373e894ad16347efe01'
 * // disabled id
 * const schema = new Schema({ name: String }, { id: false });
 * const Page = mongoose.model('Page', schema);
 * const p = new Page({ name: 'mongodb.org' });
 * console.log(p.id); // undefined
 * ```
 * @property {boolean} [_id=true] Mongoose assigns each of your schemas an `_id` field by default if one is not passed into the Schema
 * constructor. The type assigned is an `ObjectId` to coincide with MongoDB's default behavior. If you don't want an `_id` added
 * to your schema at all, you may disable it using this option.
 * You can only use this option on subdocuments. Mongoose can't save a document without knowing its `id`, so you will get an error
 * if you try to save a document without an `_id`.
 * ```js
 * // default behavior
 * const schema = new Schema({ name: String });
 * const Page = mongoose.model('Page', schema);
 * const p = new Page({ name: 'mongodb.org' });
 * console.log(p); // { _id: '50341373e894ad16347efe01', name: 'mongodb.org' }
 * // disabled _id
 * const childSchema = new Schema({ name: String }, { _id: false });
 * const parentSchema = new Schema({ children: [childSchema] });
 * const Model = mongoose.model('Model', parentSchema);
 * Model.create({ children: [{ name: 'Luke' }] }, (error, doc) => {
 *   // doc.children[0]._id will be undefined
 * });
 * ```
 * @property {boolean} [minimize=true] Mongoose will, by default, "minimize" schemas by removing empty objects
 * ```js
 * const schema = new Schema({ name: String, inventory: {} });
 * const Character = mongoose.model('Character', schema);
 * // will store `inventory` field if it is not empty
 * const frodo = new Character({ name: 'Frodo', inventory: { ringOfPower: 1 } });
 * await frodo.save();
 * let doc = await Character.findOne({ name: 'Frodo' }).lean();
 * doc.inventory; // { ringOfPower: 1 }
 * // will not store `inventory` field if it is empty
 * const sam = new Character({ name: 'Sam', inventory: {} });
 * await sam.save();
 * doc = await Character.findOne({ name: 'Sam' }).lean();
 * doc.inventory; // undefined
 * ```
 * This behavior can be overridden by setting `minimize` option to `false`. It will then store empty objects.
 * ```js
 * const schema = new Schema({ name: String, inventory: {} }, { minimize: false });
 * const Character = mongoose.model('Character', schema);
 * // will store `inventory` if empty
 * const sam = new Character({ name: 'Sam', inventory: {} });
 * await sam.save();
 * doc = await Character.findOne({ name: 'Sam' }).lean();
 * doc.inventory; // {}
 * ```
 * To check whether an object is empty, you can use the `$isEmpty()` helper:
 * ```js
 * const sam = new Character({ name: 'Sam', inventory: {} });
 * sam.$isEmpty('inventory'); // true
 * sam.inventory.barrowBlade = 1;
 * sam.$isEmpty('inventory'); // false
 * ```
 *
 * @property {string} [read] Allows setting `query.read` options at the schema level, providing us a way to apply default
 * ReadPreferences to all queries derived from a model.
 * ```js
 * const schema = new Schema({ ... }, { read: 'primary' });            // also aliased as 'p'
 * const schema = new Schema({ ... }, { read: 'primaryPreferred' });   // aliased as 'pp'
 * const schema = new Schema({ ... }, { read: 'secondary' });          // aliased as 's'
 * const schema = new Schema({ ... }, { read: 'secondaryPreferred' }); // aliased as 'sp'
 * const schema = new Schema({ ... }, { read: 'nearest' });            // aliased as 'n'
 * ```
 * The alias of each pref is also permitted so instead of having to type out 'secondaryPreferred' and getting the spelling wrong,
 * we can simply pass 'sp'.\
 * \
 * The read option also allows us to specify tag sets. These tell the driver from which members of the replica-set it should
 * attempt to read. Read more about tag sets here and here.\
 * \
 * *NOTE: you may also specify the driver read preference strategy option when connecting:*
 * ```js
 * / pings the replset members periodically to track network latency
 * const options = { replset: { strategy: 'ping' } };
 * mongoose.connect(uri, options);
 * const schema = new Schema({ ... }, { read: ['nearest', { disk: 'ssd' }] });
 * mongoose.model('JellyBean', schema);
 * ```
 * @property {WriteConcern} [writeConcern] Allows setting write concern at the schema level.
 * ```js
 * const schema = new Schema({ name: String }, {
 *   writeConcern: {
 *     w: 'majority',
 *     j: true,
 *     wtimeout: 1000
 *   }
 * });
 * ```
 * @property {{tag: number, name: number}} [shardKey] used when we have a sharded MongoDB architecture. Each sharded collection is given a shard key
 * which must be present in all insert/update operations. We just need to set this schema option to the same shard key and we’ll
 * be all set. \
 * \
 * ```js
 * new Schema({ ... }, { shardKey: { tag: 1, name: 1 } });
 * ```
 * *Note that Mongoose does not send the `shardcollection` command for you. You must configure your shards yourself.*
 * @property {*} statics an object containing methods that work for all `Schema` object defined with this option.
 * {@link https://mongoosejs.com/docs/guide.html}
 * @property {boolean} [strict=true] ensures that values passed to our model constructor that were not specified in our schema do not get saved to the db.
 * ```js
 * const thingSchema = new Schema({ ... })
 * const Thing = mongoose.model('Thing', thingSchema);
 * const thing = new Thing({ iAmNotInTheSchema: true });
 * thing.save(); // iAmNotInTheSchema is not saved to the db
 * // set to false..
 * const thingSchema = new Schema({ ... }, { strict: false });
 * const thing = new Thing({ iAmNotInTheSchema: true });
 * thing.save(); // iAmNotInTheSchema is now saved to the db!!
 * ```
 * This also affects the use of `doc.set()` to set a property value.
 * ```js
 * const thingSchema = new Schema({ ... });
 * const Thing = mongoose.model('Thing', thingSchema);
 * const thing = new Thing;
 * thing.set('iAmNotInTheSchema', true);
 * thing.save(); // iAmNotInTheSchema is not saved to the db
 * ```
 * This value can be overridden at the model instance level by passing a second boolean argument:
 * ```js
 * const Thing = mongoose.model('Thing');
 * const thing = new Thing(doc, true);  // enables strict mode
 * const thing = new Thing(doc, false); // disables strict mode
 * ```
 * The `strict` option may also be set to `"throw"` which will cause errors to be produced instead of dropping the bad data.\
 * \
 * *NOTE: Any key/val set on the instance that does not exist in your schema is always ignored, regardless of schema option.*
 * ```js
 * const thingSchema = new Schema({ ... });
 * const Thing = mongoose.model('Thing', thingSchema);
 * const thing = new Thing;
 * thing.iAmNotInTheSchema = true;
 * thing.save(); // iAmNotInTheSchema is never saved to the db
 * ```
 * @property {boolean} [strictQuery=false] Mongoose supports a separate `strictQuery` option to avoid strict mode for query filters. This is because empty query filters cause Mongoose to return all documents in the model, which can cause issues.
 * ```js
 * const mySchema = new Schema({ field: Number }, { strict: true });
 * const MyModel = mongoose.model('Test', mySchema);
 * // Mongoose will filter out `notInSchema: 1` because `strict: true`, meaning this query will return
 * // _all_ documents in the 'tests' collection
 * MyModel.find({ notInSchema: 1 });
 * ```
 * The `strict` option does apply to updates. The `strictQuery` option is just for query filters.
 * @property {JSObjectOptions} [toJSON] Exactly the same as the `toObject` option but only applies when the document's `toJSON` method is called.
 * ```js
 * const schema = new Schema({ name: String });
 * schema.path('name').get(function(v) {
 *   return v + ' is my name';
 * });
 * schema.set('toJSON', { getters: true, virtuals: false });
 * const M = mongoose.model('Person', schema);
 * const m = new M({ name: 'Max Headroom' });
 * console.log(m.toObject()); // { _id: 504e0cd7dd992d9be2f20b6f, name: 'Max Headroom' }
 * console.log(m.toJSON()); // { _id: 504e0cd7dd992d9be2f20b6f, name: 'Max Headroom is my name' }
 * // since we know toJSON is called whenever a js object is stringified:
 * console.log(JSON.stringify(m)); // { "_id": "504e0cd7dd992d9be2f20b6f", "name": "Max Headroom is my name" }
 * ```
 * @property {JSObjectOptions} [toObject] Documents have a `toObject` method which converts the mongoose document into a plain JavaScript object. This method accepts a few options. Instead of applying these options on a per-document basis, we may declare the options at the schema level and have them applied to all of the schema's documents by default.\
 * \
 * To have all virtuals show up in your console.log output, set the `toObject` option to `{ getters: true }`:
 * ```js
 * const schema = new Schema({ name: String });
 * schema.path('name').get(function(v) {
 *   return v + ' is my name';
 * });
 * schema.set('toObject', { getters: true });
 * const M = mongoose.model('Person', schema);
 * const m = new M({ name: 'Max Headroom' });
 * console.log(m); // { _id: 504e0cd7dd992d9be2f20b6f, name: 'Max Headroom is my name' }
 * ```
 * @property {string} [typeKey] By default, if you have an object with key 'type' in your schema, mongoose will interpret it as a type declaration.
 * However, for applications like geoJSON, the 'type' property is important. If you want to control which key mongoose uses to find type declarations,
 * set the 'typeKey' schema option.
 * ```js
 * const schema = new Schema({
 *   // Mongoose interprets this as 'loc is an object with 2 keys, type and coordinates'
 *   loc: { type: String, coordinates: [Number] },
 *   // Mongoose interprets this as 'name is a String'
 *   name: { $type: String }
 * }, { typeKey: '$type' }); // A '$type' key means this object is a type declaration
 * ```
 * @property {boolean} [validateBeforeSave=true] By default, documents are automatically validated before they are saved to the
 * database. This is to prevent saving an invalid document. If you want to handle validation manually, and be able to save objects
 * which don't pass validation, you can set `validateBeforeSave` to false.
 * @property {string} [versionKey="__v"] The `versionKey` is a property set on each document when first created by Mongoose. This keys
 * value contains the internal revision of the document. The `versionKey` option is a string that represents the path to use
 * for versioning. The default is `__v`
 * ```js
 * const schema = new Schema({ name: 'string' });
 * const Thing = mongoose.model('Thing', schema);
 * const thing = new Thing({ name: 'mongoose v3' });
 * await thing.save(); // { __v: 0, name: 'mongoose v3' }
 * // customized versionKey
 * new Schema({ ... }, { versionKey: '_somethingElse' })
 * const Thing = mongoose.model('Thing', schema);
 * const thing = new Thing({ name: 'mongoose v3' });
 * thing.save(); // { _somethingElse: 0, name: 'mongoose v3' }
 * ```
 * @property {boolean} [optimisticConcurrency=false]
 * Optimistic concurrency is a strategy to ensure the document you're updating didn't change between when you loaded it using `find()` or `findOne()`, and when you update it using save().
 * For example, suppose you have a House model that contains a list of photos, and a status that represents whether this house shows up in searches. Suppose that a house that has status 'APPROVED' must have at least two photos. You might implement the logic of approving a house document as shown below:
 * ```js
 * async function markApproved(id) {
 *   const house = await House.findOne({ _id });
 *   if (house.photos.length < 2) {
 *     throw new Error('House must have at least two photos!');
 *   }
 *   house.status = 'APPROVED';
 *   await house.save();
 * }
 * ```
 * The `markApproved()` function looks right in isolation, but there might be a potential issue: what if another function removes the house's photos between the `findOne()` call and the `save()` call? For example, the below code will succeed:
 * ```js
 * const house = await House.findOne({ _id });
 * if (house.photos.length < 2) {
 *   throw new Error('House must have at least two photos!');
 * }
 * const house2 = await House.findOne({ _id });
 * house2.photos = [];
 * await house2.save();
 * // Marks the house as 'APPROVED' even though it has 0 photos!
 * house.status = 'APPROVED';
 * await house.save();
 * ```
 * If you set the `optimisticConcurrency` option on the House model's schema, the above script will throw an error.
 * ```
 * const House = mongoose.model('House', Schema({
 *   status: String,
 *   photos: [String]
 * }, { optimisticConcurrency: true }));
 * const house = await House.findOne({ _id });
 * if (house.photos.length < 2) {
 *   throw new Error('House must have at least two photos!');
 * }
 * const house2 = await House.findOne({ _id });
 * house2.photos = [];
 * await house2.save();
 * // Throws 'VersionError: No matching document found for id "..." version 0'
 * house.status = 'APPROVED';
 * await house.save();
 * ```
 * @property {CollationDoc} [collation] Sets a default collation for every query and aggregation.
 * {@linkplain http://thecodebarbarian.com/a-nodejs-perspective-on-mongodb-34-collations Here's a beginner-friendly overview of collations.}
 * @property {MongooseTimeSeries} [timeseries] If you set the `timeseries` option on a schema, Mongoose will create a
 * {@linkplain https://www.mongodb.com/docs/manual/core/timeseries-collections/ timeseries collection} for any model that you create from that schema.
 * ```js
 * const schema = Schema({ name: String, timestamp: Date, metadata: Object }, {
 *   timeseries: {
 *     timeField: 'timestamp',
 *     metaField: 'metadata',
 *     granularity: 'hours'
 *   },
 *   autoCreate: false,
 *   expireAfterSeconds: 86400
 * });
 * // `Test` collection will be a timeseries collection
 * const Test = db.model('Test', schema);
 * ```
 * @property {boolean} [selectPopulatedPaths=true] By default, Mongoose will automatically `select()` any populated paths for you, unless you explicitly exclude them.
 * ```js
 * const bookSchema = new Schema({
 *   title: 'String',
 *   author: { type: 'ObjectId', ref: 'Person' }
 * });
 * const Book = mongoose.model('Book', bookSchema);
 * // By default, Mongoose will add `author` to the below `select()`.
 * await Book.find().select('title').populate('author');
 * // In other words, the below query is equivalent to the above
 * await Book.find().select('title author').populate('author');
 * ```
 * To opt out of selecting populated fields by default, set `selectPopulatedPaths` to `false` in your schema.
 * ```js
 * const bookSchema = new Schema({
 *   title: 'String',
 *   author: { type: 'ObjectId', ref: 'Person' }
 * }, { selectPopulatedPaths: false });
 * const Book = mongoose.model('Book', bookSchema);
 * // Because `selectPopulatedPaths` is false, the below doc will **not**
 * // contain an `author` property.
 * const doc = await Book.findOne().select('title').populate('author');
 * ```
 * @property {boolean} [skipVersioning=false] `skipVersioning` allows excluding paths from versioning (i.e., the internal revision
 * will not be incremented even if these paths are updated). DO NOT do this unless you know what you're doing. For subdocuments,
 * include this on the parent document using the fully qualified path.
 * @property {import("mongoose").SchemaTimestampsConfig} [timestamps]
 * The `timestamps` option tells Mongoose to assign `createdAt` and `updatedAt` fields to your
 * schema. The type assigned is `mongoose.Schema.Types.Date`.\
 * \
 * By default, the names of the fields are `createdAt` and `updatedAt`. Customize the field names by setting
 * `timestamps.createdAt` and `timestamps.updatedAt`. \
 * \
 * The way `timestamps` works under the hood is:
 * - If you create a new document, mongoose simply sets `createdAt`, and `updatedAt` to the time of creation.
 * - If you update a document, mongoose will add `updatedAt` to the `$set` object.
 * - If you set `upsert: true` on an update operation, mongoose will use `$setOnInsert` operator to add `createdAt` to the
 * document in case the upsert operation resulted into a new inserted document.
 *
 * ```js
 * const thingSchema = new Schema({ ... }, { timestamps: { createdAt: 'created_at' } });
 * const Thing = mongoose.model('Thing', thingSchema);
 * const thing = new Thing();
 * await thing.save(); // `created_at` & `updatedAt` will be included
 * // With updates, Mongoose will add `updatedAt` to `$set`
 * await Thing.updateOne({}, { $set: { name: 'Test' } });
 * // If you set upsert: true, Mongoose will add `created_at` to `$setOnInsert` as well
 * await Thing.findOneAndUpdate({}, { $set: { name: 'Test2' } });
 * // Mongoose also adds timestamps to bulkWrite() operations
 * // See https://mongoosejs.com/docs/api/model.html#model_Model-bulkWrite
 * await Thing.bulkWrite([
 *   {
 *     insertOne: {
 *       document: {
 *         name: 'Jean-Luc Picard',
 *         ship: 'USS Stargazer'
 *       // Mongoose will add `created_at` and `updatedAt`
 *       }
 *     }
 *   },
 *   {
 *     updateOne: {
 *       filter: { name: 'Jean-Luc Picard' },
 *       update: {
 *         $set: {
 *           ship: 'USS Enterprise'
 *         // Mongoose will add `updatedAt`
 *         }
 *       }
 *     }
 *   }
 * ]);
 * ```
 * By default, Mongoose uses `new Date()` to get the current time. If you want to overwrite the function Mongoose uses to get the
 * current time, you can set the `timestamps.currentTime` option. Mongoose will call the `timestamps.currentTime` function whenever
 * it needs to get the current time.
 * ```js
 * const schema = Schema({
 *   createdAt: Number,
 *   updatedAt: Number,
 *   name: String
 * }, {
 *   // Make Mongoose use Unix time (seconds since Jan 1, 1970)
 *   timestamps: { currentTime: () => Math.floor(Date.now() / 1000) }
 * });
 * ```
 * @property {string[]} [pluginTags] Mongoose supports defining global plugins, plugins that apply to all schemas.
 * @property {boolean} [storeSubdocValidationError] For legacy reasons, when there is a validation error in subpath of a single
 * nested schema, Mongoose will record that there was a validation error in the single nested schema path as well. For example:
 * ```js
 * const childSchema = new Schema({ name: { type: String, required: true } });
 * const parentSchema = new Schema({ child: childSchema });
 * const Parent = mongoose.model('Parent', parentSchema);
 * // Will contain an error for both 'child.name' _and_ 'child'
 * new Parent({ child: {} }).validateSync().errors;
 * ```
 * Set the `storeSubdocValidationError` to `false` on the child schema to make Mongoose only reports the parent error.
 * ```js
 * const childSchema = new Schema({
 *   name: { type: String, required: true }
 * }, { storeSubdocValidationError: false }); // <-- set on the child schema
 * const parentSchema = new Schema({ child: childSchema });
 * const Parent = mongoose.model('Parent', parentSchema);
 * // Will only contain an error for 'child.name'
 * new Parent({ child: {} }).validateSync().errors;
 * ```
 * @property {typeof import("mongoose").SchemaOptions.collectionOptions} [collectionOptions] Options like `collation` and capped affect the options Mongoose passes to MongoDB when
 * creating a new collection. Mongoose schemas support most MongoDB `createCollection()` options, but not all. You can use the
 * `collectionOptions` option to set any `createCollection()` options; Mongoose will use `collectionOptions` as the default values
 * when calling `createCollection()` for your schema.
 * ```js
 * const schema = new Schema({ name: String }, {
 *   autoCreate: false,
 *   collectionOptions: {
 *     capped: true,
 *     max: 1000
 *   }
 * });
 * const Test = mongoose.model('Test', schema);
 * // Equivalent to `createCollection({ capped: true, max: 1000 })`
 * await Test.createCollection();
 * ```
 * @property {*} methods
 * @property {*} query
 */

/**
 * Time series data is a sequence of data points in which insights are gained by analyzing changes over time.
 * ```js
 * const schema = Schema({ name: String, timestamp: Date, metadata: Object }, {
 *   timeseries: {
 *     timeField: 'timestamp',
 *     metaField: 'metadata',
 *     granularity: 'hours'
 *   },
 *   autoCreate: false,
 *   expireAfterSeconds: 86400
 * });
 * // `Test` collection will be a timeseries collection
 * const Test = db.model('Test', schema);
 * ```
 * @typedef {Object} MongooseTimeSeries
 * @property {string} [timeField] when the data point was recorded.
 * @property {string} [metaField] (sometimes referred to as source), which is a label or tag that uniquely identifies a series and rarely changes.
 * @property {'seconds' | 'minutes' | 'hours' | string} [granularity] (sometimes referred to as metrics or values), which are the data points tracked at increments in time.
 * @property {number} [bucketMaxSpanSeconds]
 * @property {number} [bucketRoundingSeconds]
 */
/**
 * @typedef {import("mongoose").SchemaOptions & import("mongoose").SchemaTypeOptions<T, D> & MongooseSchemaOptions} Options
 * @template T the mongoose type assigned to the "type" property
 * @template D the document type.
 */

/**
 * A validator for a given schema. Checks if the argument is in an acceptable format of a certain POJO in string format.
 * @callback Validater
 * @param {string} param the value to be checked.
 * @returns {boolean} `true` if the argument is valid, `false` if otherwise.
 */
/**
 * Gets a string message explaining why the check failed.
 * @callback ErrMessage
 * @param {{path: string, value: string}} param The reference for proper construction of an error message.
 * @returns {string} The reason {@linkcode Validater} return `false`.
 */
/**
 * A generic default message
 * @type {Alertable<string>}
 */
const defMsg = function (x) {
  return `Validation failed for model: ${x.value},
    at: ${x.path}`;
};
/**
 * @typedef {"atlasAdmin" | "readWriteAnyDatabase" | "readAnyDatabase" | "read" | "readWrite" | "dbAdmin" | "dbOwner" | "userAdmin" | "clusterAdmin" | "clusterManager" | "clusterMonitor" | "hostManager" | "backup" | "restore" | "userAdminAnyDatabase" | "dbAdminAnyDatabase" | "root" | "__system"} RoleName
 */
/**
 * @typedef {Object} RoleDocument
 * @property {RoleName} role
 * @property {string} [db]
 */
/**
 * @typedef {RoleDocument | RoleName} Role
 */
/**
 * @typedef {"SCRAM-SHA-1" | "SCRAM-SHA-256"} Mechanism
 */
/**
 * ```js
 * authenticationRestrictions: [
 *         { clientSource: [ "<IP|CIDR range>", ... ], serverAddress: [ "<IP|CIDR range>", ... ] },
 *        // ...
 *      ]
 * ```
 * @typedef {Object} AuthRestriction
 * @property {string} clientSource
 * @property {string} serverAddress
 */
/**
 * @typedef {Object} CreateUserDocument
 * @property {string} createUser The name of the new user.
 * @property {string} pwd The user's password. The `pwd` field is not required if you run `createUser` on the `$external` database
 * to create users who have credentials stored externally to MongoDB. The value can be either:
 * - the user's password in cleartext string, or
 * - `passwordPrompt()` to prompt for the user's password.
 * @property {import("mongoose").Document} [customData] Optional. Any arbitrary information. This field can be used to store any
 * data an admin wishes to associate with this particular user. For example, this could be the user's full name or employee id.
 * @property {Role[]} roles The roles granted to the user. Can specify an empty array [] to create users without roles.
 * @property {AuthRestriction[]} [authenticationRestrictions] Optional. The authentication restrictions the server enforces on the
 * created user. Specifies a list of IP addresses and CIDR ranges from which the user is allowed to connect to the server or from
 * which the server can accept users.
 * @property {import("mongoose").WriteConcern} [writeConcern] Optional. The level of write concern for the operation. See Write
 * Concern Specification.
 * @property {Mechanism[]} [mechanisms] Optional. Specify the specific SCRAM mechanism or mechanisms for creating SCRAM user
 * credentials. If authenticationMechanisms is specified, you can only specify a subset of the authenticationMechanisms.
 * @property {boolean} [digestPassword] Optional. Indicates whether the server or the client digests the
 * password.
 * If `true`, the server receives undigested password from the client and digests the password.
 * If `false`, the client digests the password and passes the digested password to the server. Not compatible with `SCRAM-SHA-256`
 * *Changed in version 4.0*: The default value is `true`. In earlier versions, the default value is `false`.
 * @property {*} [comment] A user-provided comment to attach to this command. Once set, this comment appears alongside records of
 * this command.
 * @property {UserPrivilege[]} [privileges] The privileges array contains the privilege documents that define the privileges for the role.
 */
/**
 * @typedef {Object} EnableCluster
 * @property {boolean} cluster
 */
/**
 * @typedef {Object} PrivilegeResource
 * @property {string} db
 * @property {string} collection
 */
/**
 * @typedef {"addShard" | "anyAction" | "appendOplogNote" | "applicationMessage" | "applyOps" | "authSchemaUpgrade" | "bypassDocumentValidation" | "bypassWriteBlockingMode" | "changeCustomData" | "changeOwnCustomData" | "changeOwnPassword" | "changePassword" | "changeStream" | "checkFreeMonitoringStatus" | "checkMetadataConsistency" | "cleanupOrphaned" | "clearJumboFlag" | "closeAllDatabases" | "collMod" | "collStats" | "compact" | "compactStructuredEncryptionData" | "connPoolStats" | "connPoolSync" | "convertToCapped" | "cpuProfiler" | "createCollection" | "createIndex" | "createRole" | "createSearchIndexes" | "createUser" | "dbHash" | "dbStats" | "dropCollection" | "dropConnections" | "dropDatabase" | "dropIndex" | "dropRole" | "dropSearchIndex" | "dropUser" | "enableProfiler" | "enableSharding" | "find" | "flushRouterConfig" | "forceUUID" | "fsync" | "getCmdLineOpts" | "getDefaultRWConcern" | "getLog" | "getParameter" | "getShardMap" | "getShardVersion" | "grantRole" | "hostInfo" | "impersonate" | "indexStats" | "inprog" | "insert" | "internal" | "invalidateUserCache" | "killAnyCursor" | "killAnySession" | "killCursors" | "killop" | "listCollections" | "listDatabases" | "listIndexes" | "listSearchIndexes" | "listSessions" | "listShards" | "logRotate" | "moveChunk" | "netstat" | "oidReset" | "planCacheIndexFilter" | "planCacheRead" | "planCacheWrite" | "reIndex" | "refineCollectionShardKey" | "remove" | "removeShard" | "renameCollectionSameDB" | "replSetConfigure" | "replSetGetConfig" | "replSetGetStatus" | "replSetHeartbeat" | "replSetStateChange" | "reshardCollection" | "resync" | "revokeRole" | "rotateCertificates" | "serverStatus" | "setAuthenticationRestriction" | "setDefaultRWConcern" | "setFeatureCompatibilityVersion" | "setFreeMonitoring" | "setParameter" | "setUserWriteBlockMode" | "shardedDataDistribution" | "shardingState" | "shutdown" | "splitVector" | "storageDetails" | "top" | "touch" | "unlock" | "update" | "updateSearchIndex" | "useUUID" | "validate" | "viewRole" | "viewUser"} PrivilegeAction
 */
/**
 * The privileges array contains the privilege documents that define the privileges for the role.
 * @typedef {Object} UserPrivilege
 * @property {EnableCluster | PrivilegeResource} resource A document that specifies the resources upon which the privilege
 * actions apply.
 * @property {PrivilegeAction[]} actions An array of actions permitted on the resource. For a list of actions, see
 * [Privilege Actions](https://www.mongodb.com/docs/manual/reference/privilege-actions/#std-label-security-user-actions).
 */
/**
 * Deletes a user-defined role from the database on which you run the command.
 * @typedef {Object} DropRole
 * @property {string} dropRole The name of the user-defined role to remove from the database.
 * @property {string} [writeConcern] Optional. The level of write concern for the operation. See Write Concern Specification.
 * @property {string} [comment] Optional. A user-provided comment to attach to this command. Once set, this comment appears
 * alongside records of this command in thefollowing locations:
 * - mongod log messages, in the `attr.command.cursor.comment` field.
 * - Database profiler output, in the `command.comment` field.
 * - currentOp output, in the `command.comment` field.
 * - A comment can be any valid BSON type (string, integer, object, array, etc).
 * 
 * *New in version 4.4.*
 */
/**
 * Deletes a user-defined role from the database on which you run the command.
 * @typedef {Object} DropUser
 * @property {string} dropUser The name of the user to delete. You must issue the `dropUser` command while using the database
 * where the user exists.
 * @property {string} [writeConcern] Optional. The level of write concern for the operation. See Write Concern Specification.
 * @property {string} [comment] Optional. A user-provided comment to attach to this command. Once set, this comment appears
 * alongside records of this command in thefollowing locations:
 * - mongod log messages, in the `attr.command.cursor.comment` field.
 * - Database profiler output, in the `command.comment` field.
 * - currentOp output, in the `command.comment` field.
 * - A comment can be any valid BSON type (string, integer, object, array, etc).
 * 
 * *New in version 4.4.*
 */
/**
 * Removes all users from the database on which you run the command.
 * @typedef {Object} DropAllUsers
 * @property {1} dropAllUsersFromDatabase Specify `1` to drop all the users from the current database.
 * @property {string} [writeConcern] Optional. The level of write concern for the operation. See Write Concern Specification.
 * @property {string} [comment] Optional. A user-provided comment to attach to this command. Once set, this comment appears
 * alongside records of this command in thefollowing locations:
 * - mongod log messages, in the `attr.command.cursor.comment` field.
 * - Database profiler output, in the `command.comment` field.
 * - `currentOp` output, in the `command.comment` field.
 * - A comment can be any valid BSON type (string, integer, object, array, etc).
 * 
 * *New in version 4.4.*
 */
/**
 * 
 * @typedef {Object} DropAllUsersReturnVal
 * @property {1} ok specifies that the command was successful
 * @property {number} n  shows the number of users removed
 */

module.exports = {
  defMsg,
};
