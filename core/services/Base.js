class BaseService {
  constructor(model) {
    this.model = model;
  }

  async save(objects) {
    return this.model.insertMany(objects);
  }

  async load() {
    return this.model.find().lean();
  }

  async insert(object) {
    return this.model.create(object);
  }

  async removeBy(property, value) {
    return this.model.deleteOne({ [property]: value });
  }

  async update(id, object) {
    return this.model.findByIdAndUpdate(id, object, { new: true });
  }

  async findOneAndUpdate(condition, update) {
    return this.model.findOneAndUpdate(condition, update, { new: true });
  }

  async find(id) {
    return this.model.findById(id);
  }

  async findOne(value) {
    return this.model.findOne(value);
  }

  async query(obj) {
    return this.model.find(obj);
  }

  async findBy(property, value) {
    return this.model.find({ [property]: value });
  }

  async paginate(condition, query) {
    console.log("condition :>> ", condition);
    console.log("query :>> ", query);
    const sort = query.sort
      ? {
          [query?.sort]: query?.sort.startsWith("-") ? -1 : +1,
        }
      : { createdAt: -1 };
    const skip = query.skip ? (query?.page - 1) * query?.limit : 0;
    return this.model
      .find(condition)
      .sort(sort)
      .skip(skip)
      .limit(Math.min(query.limit || 10, 20))
      .lean();
  }
}

module.exports = BaseService;
