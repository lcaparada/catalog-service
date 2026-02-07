import { ObjectId } from 'mongodb';
import { Entity } from './entity';

type StubProps = {
  prop1: string;
  prop2: number;
};

class StubEntity extends Entity<StubProps> {}

describe('Entity unit tests', () => {
  it('should set props and id', () => {
    const props = {
      prop1: 'value1',
      prop2: 15,
    };

    const entity = new StubEntity(props);

    expect(entity.props).toStrictEqual(props);
    expect(entity.id).not.toBeNull();
    expect(ObjectId.isValid(entity.id)).toBeTruthy();
  });

  it('should accepted a valid ObjectId', () => {
    const props = {
      prop1: 'value1',
      prop2: 15,
    };
    const id = new ObjectId().toString();

    const entity = new StubEntity(props, id);

    expect(ObjectId.isValid(entity.id)).toBeTruthy();
    expect(entity.id).toStrictEqual(id);
  });

  it('shoud convert entity to json', () => {
    const props = {
      prop1: 'value1',
      prop2: 15,
    };
    const id = '1703ad38-9686-4a61-8b7a-bc64cc9c5f5c';

    const entity = new StubEntity(props, id);

    expect(entity.toJSON()).toStrictEqual({ id, ...props });
  });
});
