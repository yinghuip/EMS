import { Injectable, signal, computed } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventModel } from '../models/event.model';

@Injectable({ providedIn: 'root' })
export class EventService {
  private eventsSignal = signal<EventModel[]>([
    // 2026 Events
    {
      id: '1',
      title: 'Modern Web Conference 2026',
      slug: 'modern-web-conference-2026',
      short_description: 'A conference about modern web development practices.',
      description: '<p>Join us to hear talks about web frameworks, accessibility, and performance.</p>',
      start_datetime: '2026-03-18T09:00:00Z',
      end_datetime: '2026-03-18T17:00:00Z',
      location: { name: 'Convention Center', address: '123 Main St, City' },
      hero_image_url: 'assets/images/ng-conf.png',
      speakers: [
        { name: 'Ada Developer', bio: 'Frontend Engineer' },
        { name: 'Linus Architect', bio: 'Platform Architect' }
      ],
      tags: ['conference', 'web', 'frontend'],
      published_at: new Date().toISOString(),
      is_featured: true
    },
    {
      id: '2',
      title: 'AI & Machine Learning Summit',
      slug: 'ai-ml-summit-2026',
      short_description: 'Explore the latest in AI and machine learning technologies.',
      description: '<p>Deep dive into neural networks, NLP, and practical AI applications.</p>',
      start_datetime: '2026-05-15T08:00:00Z',
      end_datetime: '2026-05-16T18:00:00Z',
      location: { name: 'Tech Hub Center', address: '789 Innovation Ave, San Francisco' },
      hero_image_url: '',
      speakers: [
        { name: 'Dr. Sarah Chen', bio: 'AI Research Lead' },
        { name: 'Marcus Stone', bio: 'ML Engineer' }
      ],
      tags: ['AI', 'machine-learning', 'conference'],
      published_at: new Date().toISOString(),
      is_featured: false
    },
    {
      id: '3',
      title: 'DevOps Workshop 2026',
      slug: 'devops-workshop-2026',
      short_description: 'Hands-on workshop for modern DevOps practices.',
      description: '<p>Learn CI/CD, containerization, and cloud infrastructure management.</p>',
      start_datetime: '2026-06-22T09:00:00Z',
      end_datetime: '2026-06-22T17:00:00Z',
      location: { name: 'Cloud Academy', address: '456 Server St, Seattle' },
      hero_image_url: '',
      speakers: [{ name: 'James Docker', bio: 'DevOps Specialist' }],
      tags: ['devops', 'workshop', 'cloud'],
      published_at: new Date().toISOString(),
      is_featured: false
    },
    {
      id: '4',
      title: 'Mobile Development Bootcamp',
      slug: 'mobile-dev-bootcamp-2026',
      short_description: 'Intensive bootcamp for iOS and Android development.',
      description: '<p>Master native and cross-platform mobile app development.</p>',
      start_datetime: '2026-07-10T09:00:00Z',
      end_datetime: '2026-07-12T17:00:00Z',
      location: { name: 'Mobile Lab', address: '321 App Lane, Austin' },
      hero_image_url: '',
      speakers: [
        { name: 'Emma Swift', bio: 'iOS Lead Developer' },
        { name: 'Raj Patel', bio: 'Android Architect' }
      ],
      tags: ['mobile', 'bootcamp', 'iOS', 'android'],
      published_at: new Date().toISOString(),
      is_featured: false
    },
    {
      id: '5',
      title: 'Cybersecurity Conference 2026',
      slug: 'cybersecurity-conf-2026',
      short_description: 'Latest trends in cybersecurity and threat prevention.',
      description: '<p>Learn about security best practices, ethical hacking, and data protection.</p>',
      start_datetime: '2026-08-05T08:30:00Z',
      end_datetime: '2026-08-06T17:30:00Z',
      location: { name: 'Security Center', address: '567 Guard Blvd, Washington DC' },
      hero_image_url: '',
      speakers: [
        { name: 'Alex Shield', bio: 'Security Researcher' },
        { name: 'Nina Firewall', bio: 'Ethical Hacker' }
      ],
      tags: ['security', 'conference', 'cybersecurity'],
      published_at: new Date().toISOString(),
      is_featured: false
    },
    {
      id: '6',
      title: 'Data Science Symposium',
      slug: 'data-science-symposium-2026',
      short_description: 'Advanced data analytics and visualization techniques.',
      description: '<p>Explore big data, analytics tools, and predictive modeling.</p>',
      start_datetime: '2026-09-14T09:00:00Z',
      end_datetime: '2026-09-15T17:00:00Z',
      location: { name: 'Analytics Arena', address: '890 Data Dr, Boston' },
      hero_image_url: '',
      speakers: [{ name: 'Dr. Lisa Numbers', bio: 'Data Scientist' }],
      tags: ['data-science', 'analytics', 'symposium'],
      published_at: new Date().toISOString(),
      is_featured: false
    },
    {
      id: '7',
      title: 'Cloud Computing Summit',
      slug: 'cloud-summit-2026',
      short_description: 'Multi-cloud strategies and serverless architectures.',
      description: '<p>Discover AWS, Azure, and GCP best practices.</p>',
      start_datetime: '2026-10-20T08:00:00Z',
      end_datetime: '2026-10-21T18:00:00Z',
      location: { name: 'Sky Convention Center', address: '234 Cloud Ave, Denver' },
      hero_image_url: '',
      speakers: [
        { name: 'Chris Lambda', bio: 'Cloud Architect' },
        { name: 'Taylor S3', bio: 'Solutions Engineer' }
      ],
      tags: ['cloud', 'aws', 'azure', 'summit'],
      published_at: new Date().toISOString(),
      is_featured: false
    },
    {
      id: '8',
      title: 'UX/UI Design Conference',
      slug: 'ux-ui-conf-2026',
      short_description: 'User experience and interface design best practices.',
      description: '<p>Learn design thinking, prototyping, and user research methods.</p>',
      start_datetime: '2026-11-08T09:00:00Z',
      end_datetime: '2026-11-09T17:00:00Z',
      location: { name: 'Design Studio', address: '678 Creative Rd, Portland' },
      hero_image_url: '',
      speakers: [{ name: 'Sophie Colors', bio: 'Senior UX Designer' }],
      tags: ['ux', 'ui', 'design', 'conference'],
      published_at: new Date().toISOString(),
      is_featured: false
    },
    {
      id: '9',
      title: 'Blockchain & Web3 Forum',
      slug: 'blockchain-web3-2026',
      short_description: 'Decentralized technologies and cryptocurrency trends.',
      description: '<p>Explore smart contracts, DeFi, and blockchain applications.</p>',
      start_datetime: '2026-12-03T10:00:00Z',
      end_datetime: '2026-12-04T16:00:00Z',
      location: { name: 'Crypto Hall', address: '999 Chain St, Miami' },
      hero_image_url: '',
      speakers: [
        { name: 'Victor Block', bio: 'Blockchain Developer' },
        { name: 'Satoshi Smith', bio: 'Crypto Analyst' }
      ],
      tags: ['blockchain', 'web3', 'cryptocurrency', 'forum'],
      published_at: new Date().toISOString(),
      is_featured: false
    },
    // 2025 Events
    {
      id: '10',
      title: 'Local Dev Meetup January',
      slug: 'local-dev-meetup-jan-2025',
      short_description: 'Monthly community meetup for local developers.',
      description: '<p>Network with peers and share knowledge on latest tech trends.</p>',
      start_datetime: '2025-01-20T18:30:00Z',
      end_datetime: '2025-01-20T21:30:00Z',
      location: { name: 'Community Hall', address: '456 Dev St, City' },
      hero_image_url: '',
      speakers: [],
      tags: ['meetup', 'community', 'networking'],
      published_at: new Date().toISOString(),
      is_featured: false
    },
    {
      id: '11',
      title: 'JavaScript Framework Showdown',
      slug: 'js-framework-showdown-2025',
      short_description: 'Compare React, Vue, Angular, and Svelte.',
      description: '<p>Deep dive into modern JavaScript frameworks and their use cases.</p>',
      start_datetime: '2025-02-14T09:00:00Z',
      end_datetime: '2025-02-14T17:00:00Z',
      location: { name: 'Tech Arena', address: '111 Framework Blvd, Chicago' },
      hero_image_url: '',
      speakers: [
        { name: 'Jordan React', bio: 'Frontend Lead' },
        { name: 'Vue Master', bio: 'JavaScript Expert' }
      ],
      tags: ['javascript', 'react', 'vue', 'angular', 'workshop'],
      published_at: new Date().toISOString(),
      is_featured: false
    },
    {
      id: '12',
      title: 'Python for Data Science',
      slug: 'python-data-science-2025',
      short_description: 'Master Python for data analysis and visualization.',
      description: '<p>Learn pandas, numpy, matplotlib, and scikit-learn.</p>',
      start_datetime: '2025-03-22T09:00:00Z',
      end_datetime: '2025-03-23T17:00:00Z',
      location: { name: 'Python Center', address: '222 Snake Ave, New York' },
      hero_image_url: '',
      speakers: [{ name: 'Dr. Guido Matrix', bio: 'Data Science Lead' }],
      tags: ['python', 'data-science', 'workshop'],
      published_at: new Date().toISOString(),
      is_featured: false
    },
    {
      id: '13',
      title: 'Agile & Scrum Certification',
      slug: 'agile-scrum-cert-2025',
      short_description: 'Get certified in Agile methodologies and Scrum framework.',
      description: '<p>Interactive workshop with real-world project management scenarios.</p>',
      start_datetime: '2025-04-10T08:00:00Z',
      end_datetime: '2025-04-12T18:00:00Z',
      location: { name: 'Agile Academy', address: '333 Sprint St, Atlanta' },
      hero_image_url: '',
      speakers: [{ name: 'Michelle Standups', bio: 'Certified Scrum Master' }],
      tags: ['agile', 'scrum', 'certification', 'workshop'],
      published_at: new Date().toISOString(),
      is_featured: false
    },
    {
      id: '14',
      title: 'Game Development Conference',
      slug: 'game-dev-conf-2025',
      short_description: 'Creating immersive gaming experiences.',
      description: '<p>Learn Unity, Unreal Engine, and game design principles.</p>',
      start_datetime: '2025-05-18T09:00:00Z',
      end_datetime: '2025-05-20T17:00:00Z',
      location: { name: 'Gaming Arena', address: '444 Pixel Rd, Los Angeles' },
      hero_image_url: '',
      speakers: [
        { name: 'Mario Maker', bio: 'Game Designer' },
        { name: 'Zelda Coder', bio: 'Unity Developer' }
      ],
      tags: ['game-dev', 'unity', 'conference'],
      published_at: new Date().toISOString(),
      is_featured: false
    },
    {
      id: '15',
      title: 'Tech Startup Pitch Night',
      slug: 'startup-pitch-2025',
      short_description: 'Pitch your startup idea to investors.',
      description: '<p>Network with VCs and showcase innovative tech solutions.</p>',
      start_datetime: '2025-06-25T18:00:00Z',
      end_datetime: '2025-06-25T22:00:00Z',
      location: { name: 'Startup Hub', address: '555 Venture Ln, Silicon Valley' },
      hero_image_url: '',
      speakers: [],
      tags: ['startup', 'pitch', 'networking', 'vc'],
      published_at: new Date().toISOString(),
      is_featured: false
    },
    {
      id: '16',
      title: 'IoT & Smart Devices Workshop',
      slug: 'iot-workshop-2025',
      short_description: 'Building connected devices with IoT technologies.',
      description: '<p>Hands-on with Arduino, Raspberry Pi, and IoT protocols.</p>',
      start_datetime: '2025-07-16T09:00:00Z',
      end_datetime: '2025-07-17T17:00:00Z',
      location: { name: 'IoT Lab', address: '666 Connected Dr, Phoenix' },
      hero_image_url: '',
      speakers: [{ name: 'Alice Sensor', bio: 'IoT Engineer' }],
      tags: ['iot', 'workshop', 'hardware'],
      published_at: new Date().toISOString(),
      is_featured: false
    },
    {
      id: '17',
      title: 'Full Stack Web Development',
      slug: 'full-stack-bootcamp-2025',
      short_description: 'Complete bootcamp from frontend to backend.',
      description: '<p>Master HTML, CSS, JavaScript, Node.js, and databases.</p>',
      start_datetime: '2025-08-12T09:00:00Z',
      end_datetime: '2025-08-16T17:00:00Z',
      location: { name: 'Code Academy', address: '777 Stack Ave, Dallas' },
      hero_image_url: '',
      speakers: [
        { name: 'Bob Fullstack', bio: 'Senior Developer' },
        { name: 'Carol Backend', bio: 'API Architect' }
      ],
      tags: ['full-stack', 'bootcamp', 'web-development'],
      published_at: new Date().toISOString(),
      is_featured: false
    },
    {
      id: '18',
      title: 'Digital Marketing for Tech',
      slug: 'digital-marketing-tech-2025',
      short_description: 'Marketing strategies for tech products and services.',
      description: '<p>Learn SEO, content marketing, and growth hacking.</p>',
      start_datetime: '2025-09-08T09:00:00Z',
      end_datetime: '2025-09-09T17:00:00Z',
      location: { name: 'Marketing Center', address: '888 Growth St, Nashville' },
      hero_image_url: '',
      speakers: [{ name: 'Sam SEO', bio: 'Digital Marketing Expert' }],
      tags: ['marketing', 'seo', 'workshop'],
      published_at: new Date().toISOString(),
      is_featured: false
    },
    {
      id: '19',
      title: 'Open Source Contributor Summit',
      slug: 'open-source-summit-2025',
      short_description: 'Collaborate on open source projects.',
      description: '<p>Meet maintainers, contribute to projects, and learn OSS best practices.</p>',
      start_datetime: '2025-10-15T09:00:00Z',
      end_datetime: '2025-10-16T17:00:00Z',
      location: { name: 'Open Hall', address: '999 Commons Ave, Portland' },
      hero_image_url: '',
      speakers: [],
      tags: ['open-source', 'community', 'summit'],
      published_at: new Date().toISOString(),
      is_featured: false
    },
    {
      id: '20',
      title: 'Women in Tech Leadership',
      slug: 'women-tech-leadership-2025',
      short_description: 'Empowering women leaders in technology.',
      description: '<p>Panel discussions, mentorship, and networking opportunities.</p>',
      start_datetime: '2025-11-12T09:00:00Z',
      end_datetime: '2025-11-12T17:00:00Z',
      location: { name: 'Empowerment Center', address: '101 Leader Ln, Minneapolis' },
      hero_image_url: '',
      speakers: [
        { name: 'Grace Hopper Jr.', bio: 'CTO' },
        { name: 'Ada Lovelace II', bio: 'Tech VP' }
      ],
      tags: ['diversity', 'leadership', 'women-in-tech'],
      published_at: new Date().toISOString(),
      is_featured: false
    },
    // 2024 Events
    {
      id: '21',
      title: 'New Year Code Challenge',
      slug: 'new-year-code-2024',
      short_description: 'Start 2024 with coding challenges and competitions.',
      description: '<p>Test your skills with algorithmic problems and win prizes.</p>',
      start_datetime: '2024-01-15T10:00:00Z',
      end_datetime: '2024-01-15T18:00:00Z',
      location: { name: 'Code Arena', address: '202 Algorithm Ave, Boston' },
      hero_image_url: '',
      speakers: [],
      tags: ['coding', 'competition', 'challenge'],
      published_at: new Date().toISOString(),
      is_featured: false
    },
    {
      id: '22',
      title: 'Docker & Kubernetes Masterclass',
      slug: 'docker-k8s-masterclass-2024',
      short_description: 'Deep dive into containerization and orchestration.',
      description: '<p>From Docker basics to advanced Kubernetes deployments.</p>',
      start_datetime: '2024-03-05T09:00:00Z',
      end_datetime: '2024-03-07T17:00:00Z',
      location: { name: 'Container Hub', address: '303 Pod St, San Jose' },
      hero_image_url: '',
      speakers: [{ name: 'Captain Kubernetes', bio: 'DevOps Architect' }],
      tags: ['docker', 'kubernetes', 'devops', 'masterclass'],
      published_at: new Date().toISOString(),
      is_featured: false
    },
    {
      id: '23',
      title: 'SQL vs NoSQL Database Wars',
      slug: 'database-wars-2024',
      short_description: 'Choosing the right database for your project.',
      description: '<p>Compare relational and non-relational databases.</p>',
      start_datetime: '2024-04-20T09:00:00Z',
      end_datetime: '2024-04-20T17:00:00Z',
      location: { name: 'Data Center', address: '404 Query Blvd, Seattle' },
      hero_image_url: '',
      speakers: [
        { name: 'Mongo Master', bio: 'NoSQL Expert' },
        { name: 'Postgres Pro', bio: 'Database Administrator' }
      ],
      tags: ['database', 'sql', 'nosql', 'workshop'],
      published_at: new Date().toISOString(),
      is_featured: false
    },
    {
      id: '24',
      title: 'Ethical AI Development',
      slug: 'ethical-ai-2024',
      short_description: 'Building responsible and fair AI systems.',
      description: '<p>Discuss bias, fairness, and ethical considerations in AI.</p>',
      start_datetime: '2024-06-10T09:00:00Z',
      end_datetime: '2024-06-11T17:00:00Z',
      location: { name: 'Ethics Institute', address: '505 Fair Ave, Cambridge' },
      hero_image_url: '',
      speakers: [{ name: 'Dr. Ethics AI', bio: 'AI Ethics Researcher' }],
      tags: ['ai', 'ethics', 'conference'],
      published_at: new Date().toISOString(),
      is_featured: false
    },
    {
      id: '25',
      title: 'Remote Work Tech Tools',
      slug: 'remote-work-tools-2024',
      short_description: 'Essential tools and practices for remote teams.',
      description: '<p>Learn about collaboration tools, productivity, and work-life balance.</p>',
      start_datetime: '2024-07-18T14:00:00Z',
      end_datetime: '2024-07-18T18:00:00Z',
      location: { name: 'Virtual Venue', address: 'Online Event' },
      hero_image_url: '',
      speakers: [],
      tags: ['remote-work', 'tools', 'productivity'],
      published_at: new Date().toISOString(),
      is_featured: false
    },
    {
      id: '26',
      title: 'GraphQL API Workshop',
      slug: 'graphql-workshop-2024',
      short_description: 'Modern API development with GraphQL.',
      description: '<p>Build flexible and efficient APIs with GraphQL.</p>',
      start_datetime: '2024-08-22T09:00:00Z',
      end_datetime: '2024-08-23T17:00:00Z',
      location: { name: 'API Center', address: '606 Query St, Austin' },
      hero_image_url: '',
      speakers: [{ name: 'Apollo Dev', bio: 'GraphQL Specialist' }],
      tags: ['graphql', 'api', 'workshop'],
      published_at: new Date().toISOString(),
      is_featured: false
    },
    {
      id: '27',
      title: 'Tech Career Fair 2024',
      slug: 'tech-career-fair-2024',
      short_description: 'Connect with top tech employers.',
      description: '<p>Job opportunities from leading tech companies.</p>',
      start_datetime: '2024-09-30T10:00:00Z',
      end_datetime: '2024-09-30T17:00:00Z',
      location: { name: 'Career Center', address: '707 Jobs Ave, San Francisco' },
      hero_image_url: '',
      speakers: [],
      tags: ['career', 'jobs', 'networking', 'fair'],
      published_at: new Date().toISOString(),
      is_featured: false
    },
    // 2023 Events
    {
      id: '28',
      title: 'TypeScript Deep Dive',
      slug: 'typescript-deep-dive-2023',
      short_description: 'Advanced TypeScript patterns and techniques.',
      description: '<p>Master generics, decorators, and advanced types.</p>',
      start_datetime: '2023-05-15T09:00:00Z',
      end_datetime: '2023-05-16T17:00:00Z',
      location: { name: 'Type Hub', address: '808 Static St, Portland' },
      hero_image_url: '',
      speakers: [{ name: 'Anders Type', bio: 'TypeScript Core Team' }],
      tags: ['typescript', 'javascript', 'workshop'],
      published_at: new Date().toISOString(),
      is_featured: false
    },
    {
      id: '29',
      title: 'Microservices Architecture',
      slug: 'microservices-arch-2023',
      short_description: 'Building scalable microservices systems.',
      description: '<p>Learn service decomposition, API gateways, and distributed systems.</p>',
      start_datetime: '2023-08-10T09:00:00Z',
      end_datetime: '2023-08-12T17:00:00Z',
      location: { name: 'Architecture Lab', address: '909 Service Rd, Denver' },
      hero_image_url: '',
      speakers: [
        { name: 'Martin Fowler Jr.', bio: 'Software Architect' },
        { name: 'Sam Newman II', bio: 'Microservices Expert' }
      ],
      tags: ['microservices', 'architecture', 'conference'],
      published_at: new Date().toISOString(),
      is_featured: false
    },
    {
      id: '30',
      title: 'Year End Tech Retrospective',
      slug: 'year-end-retro-2023',
      short_description: 'Review 2023 tech trends and look ahead to 2024.',
      description: '<p>Panel discussion on the biggest tech moments of the year.</p>',
      start_datetime: '2023-12-15T17:00:00Z',
      end_datetime: '2023-12-15T20:00:00Z',
      location: { name: 'Retrospective Hall', address: '1010 Review Ave, Chicago' },
      hero_image_url: '',
      speakers: [],
      tags: ['retrospective', 'trends', 'panel'],
      published_at: new Date().toISOString(),
      is_featured: false
    }
  ]);

  private latestEventSignal = computed(() => {
    const events = this.eventsSignal();
    const featured = events.find(e => e.is_featured);
    if (featured) return featured;
    return events.sort((a, b) => 
      new Date(b.published_at!).getTime() - new Date(a.published_at!).getTime()
    )[0];
  });

  // Expose observables created in the injection context (field initializers)
  // so tests and consumers can subscribe without hitting NG0203.
  readonly events$: Observable<EventModel[]> = toObservable(this.eventsSignal);
  readonly latest$: Observable<EventModel | undefined> = toObservable(this.latestEventSignal);

  getEvents(): Observable<EventModel[]> {
    return this.events$;
  }

  getLatest(): Observable<EventModel | undefined> {
    return this.latest$;
  }

  getEventById(id: string): Observable<EventModel | undefined> {
    return this.events$.pipe(map(list => list.find(e => e.id === id)));
  }
}
