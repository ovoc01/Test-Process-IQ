import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, Edit, Trash2, CheckCircle, FileText, Loader2 } from 'lucide-react';
import api from '../api/client';
import { type Candidate } from '../types/candidate';

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'danger' | 'outline' | 'success' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  border: ${(props) => props.variant === 'outline' ? '1px solid var(--gray-200)' : 'none'};
  background-color: ${(props) => {
    switch (props.variant) {
      case 'primary': return 'var(--primary)';
      case 'danger': return 'var(--danger)';
      case 'success': return 'var(--success)';
      case 'outline': return 'white';
      default: return 'var(--gray-100)';
    }
  }};
  color: ${(props) => props.variant === 'outline' ? 'var(--gray-700)' : 'white'};

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
`;

const DetailItem = styled.div`
  span {
    display: block;
    font-size: 0.875rem;
    color: var(--gray-700);
    margin-bottom: 0.25rem;
  }
  p {
    font-size: 1.125rem;
    font-weight: 500;
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${(props) => {
    switch (props.status) {
      case 'validated': return '#dcfce7';
      case 'rejected': return '#fee2e2';
      default: return '#fef3c7';
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case 'validated': return '#166534';
      case 'rejected': return '#991b1b';
      default: return '#92400e';
    }
  }};
`;

const CandidateDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    async function fetchCandidate() {
      try {
        const response = await api.get(`/candidates/${id}`);
        setCandidate(response.data);
      } catch (err) {
        console.error(err);
        navigate('/');
      }
    }

    void fetchCandidate();
  }, [id, navigate]);

  const handleValidate = async () => {
    try {
      setIsValidating(true);
      await api.post(`/candidates/${id}/validate`);
      async function fetchCandidate() {
        try {
          const response = await api.get(`/candidates/${id}`);
          setCandidate(response.data);
        } catch (err) {
          console.error(err);
          navigate('/');
        }
      }
      // The status will change after 2s on the backend, so we should probably poll or just show a message.
      // For this test, we'll just wait 2.5s then refresh.
      setTimeout(() => {
        fetchCandidate();
        setIsValidating(false);
      }, 2500);
    } catch (err) {
      console.error(err);
      setIsValidating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        await api.delete(`/candidates/${id}`);
        navigate('/');
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDownloadReport = async () => {
    if (!candidate) return;
    try {
      const response = await api.get(`/candidates/${id}/report`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${candidate.lastName}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
    }
  };

  if (!candidate) return <p>Loading...</p>;

  return (
    <Container>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', textDecoration: 'none', color: 'var(--gray-700)' }}>
        <ArrowLeft size={20} /> Back to List
      </Link>

      <Card>
        <Header>
          <div>
            <h1>{candidate.firstName} {candidate.lastName}</h1>
            <StatusBadge status={candidate.status}>{candidate.status}</StatusBadge>
          </div>
          <ActionButtons>
            <Button variant="outline" onClick={handleDownloadReport}>
              <FileText size={20} /> Report
            </Button>
            <Button variant="outline" onClick={() => navigate(`/candidates/${id}/edit`)}>
              <Edit size={20} /> Edit
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              <Trash2 size={20} /> Delete
            </Button>
          </ActionButtons>
        </Header>

        <DetailGrid>
          <DetailItem>
            <span>Email</span>
            <p>{candidate.email}</p>
          </DetailItem>
          <DetailItem>
            <span>Phone</span>
            <p>{candidate.phone}</p>
          </DetailItem>
          <DetailItem>
            <span>Created At</span>
            <p>{new Date(candidate.createdAt).toLocaleDateString()}</p>
          </DetailItem>
        </DetailGrid>

        {candidate.status !== 'validated' && (
          <Button
            variant="success"
            style={{ marginTop: '2rem', width: '100%' }}
            onClick={handleValidate}
            disabled={isValidating}
          >
            {isValidating ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Validating (Wait 2s)...
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                Validate Candidate
              </>
            )}
          </Button>
        )}
      </Card>
    </Container>
  );
};

export default CandidateDetailPage;
