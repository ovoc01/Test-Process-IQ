import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Candidate, { CandidateStatus } from '../models/Candidate';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Candidate.deleteMany({});
});

describe('Candidate Model', () => {
  it('should create a candidate successfully', async () => {
    const candidateData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '1234567890',
    };
    const candidate = await Candidate.create(candidateData);
    expect(candidate.firstName).toBe('John');
    expect(candidate.status).toBe(CandidateStatus.PENDING);
    expect(candidate.isDeleted).toBe(false);
  });

  it('should not find deleted candidates', async () => {
    const candidate = await Candidate.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '1234567890',
      isDeleted: true,
    });
    
    const found = await Candidate.findById(candidate._id);
    expect(found).toBeNull();
  });
});
