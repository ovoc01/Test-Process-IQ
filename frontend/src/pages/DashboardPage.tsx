import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Plus, Search, ChevronLeft, ChevronRight, LogOut, FileText } from 'lucide-react';
import api from '../api/client';
import { type CandidateResponse } from '../types/candidate';
import { useAuth } from '../hooks/useAuth';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
  min-width: 300px;

  input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 1px solid var(--gray-200);
    border-radius: 8px;
  }

  svg {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--gray-700);
  }
`;

const FilterSelect = styled.select`
  padding: 0.75rem;
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  background: white;
`;

const AddButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: var(--primary);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;

  &:hover {
    background-color: var(--primary-hover);
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: none;
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  color: var(--gray-700);

  &:hover {
    background: var(--gray-100);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  background: var(--gray-100);
  font-weight: 600;
  border-bottom: 1px solid var(--gray-200);
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid var(--gray-200);
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${(props) => {
    switch (props.status) {
      case 'validated':
        return '#dcfce7';
      case 'rejected':
        return '#fee2e2';
      default:
        return '#fef3c7';
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case 'validated':
        return '#166534';
      case 'rejected':
        return '#991b1b';
      default:
        return '#92400e';
    }
  }};
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const PageButton = styled.button`
  padding: 0.5rem;
  border: 1px solid var(--gray-200);
  border-radius: 4px;
  background: white;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DashboardPage: React.FC = () => {
  const [data, setData] = useState<CandidateResponse | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const response = await api.get('/candidates', {
          params: { page, search, status, limit: 10 },
        });
        setData(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    void fetchCandidates();
  }, [page, search, status]);

  const handleDownloadReport = async (id: string, lastName: string) => {
    try {
      const response = await api.get(`/candidates/${id}/report`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${lastName}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container>
      <Header>
        <h1>Candidate Management</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <AddButton to="/candidates/new">
            <Plus size={20} /> Add Candidate
          </AddButton>
          <LogoutButton onClick={() => logout()}>
            <LogOut size={20} /> Logout
          </LogoutButton>
        </div>
      </Header>

      <Controls>
        <SearchBox>
          <Search size={20} />
          <input
            type="text"
            placeholder="Search candidates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </SearchBox>
        <FilterSelect value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="validated">Validated</option>
          <option value="rejected">Rejected</option>
        </FilterSelect>
      </Controls>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Phone</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {data?.candidates.map((candidate) => (
                <tr key={candidate._id}>
                  <Td>
                    <Link to={`/candidates/${candidate._id}`} style={{ textDecoration: 'none', color: 'inherit', fontWeight: 500 }}>
                      {candidate.firstName} {candidate.lastName}
                    </Link>
                  </Td>
                  <Td>{candidate.email}</Td>
                  <Td>{candidate.phone}</Td>
                  <Td>
                    <StatusBadge status={candidate.status}>{candidate.status}</StatusBadge>
                  </Td>
                  <Td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleDownloadReport(candidate._id, candidate.lastName)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}
                        title="Download Report"
                      >
                        <FileText size={20} />
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Pagination>
            <PageButton
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft size={20} />
            </PageButton>
            <span>
              Page {page} of {data?.totalPages || 1}
            </span>
            <PageButton
              onClick={() => setPage((p) => Math.min(data?.totalPages || 1, p + 1))}
              disabled={page === data?.totalPages}
            >
              <ChevronRight size={20} />
            </PageButton>
          </Pagination>
        </>
      )}
    </Container>
  );
};

export default DashboardPage;
