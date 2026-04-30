import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TicketsService, Ticket } from './tickets.service';
import { AuthService } from '../auth/auth.service';
import { ToastService } from '../../core/toast.service';
import { API_BASE } from '../../core/api';

interface Facility { id: string; name: string; type: string; status: string; }
interface Technician { id: string; fullName: string; }

@Component({
  standalone: true,
  selector: 'app-tickets-page',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-wrapper">

      <!-- ── Page Header ─────────────────────────────────────────────────── -->
      <div class="page-header">
        <div>
          <h2 class="page-title">
            {{ isTechnician ? '🔧 Assigned Tickets' : '🎫 My Tickets' }}
          </h2>
          <p class="page-subtitle">
            {{ isTechnician
               ? 'Tickets assigned to you for resolution'
               : 'View and manage your maintenance requests' }}
          </p>
        </div>
        <button *ngIf="!isTechnician && !isAdmin" (click)="openCreate()" class="btn-primary">
          + New Ticket
        </button>
      </div>

      <!-- ── Stats bar ───────────────────────────────────────────────────── -->
      <div class="stats-bar">
        <div class="stat-pill" *ngFor="let s of statusCounts">
          <span class="dot" [ngClass]="s.cls"></span>
          <span>{{ s.label }}</span>
          <strong>{{ s.count }}</strong>
        </div>
      </div>

      <!-- ── Filters ─────────────────────────────────────────────────────── -->
      <div class="filter-row">
        <select [(ngModel)]="filterStatus" (change)="applyFilter()">
          <option value="">All Statuses</option>
          <option *ngFor="let s of statuses" [value]="s">{{ s }}</option>
        </select>
        <select [(ngModel)]="filterPriority" (change)="applyFilter()">
          <option value="">All Priorities</option>
          <option *ngFor="let p of priorities" [value]="p">{{ p }}</option>
        </select>
        <input [(ngModel)]="filterSearch" (input)="applyFilter()"
               placeholder="Search description…" class="search-input" />
      </div>

      <!-- ── Ticket list ─────────────────────────────────────────────────── -->
      <div *ngIf="loading" class="loading-state">Loading tickets…</div>

      <div *ngIf="!loading && filtered.length === 0" class="empty-state">
        <span class="empty-icon">📭</span>
        <p>No tickets found</p>
        <button *ngIf="!isTechnician && !isAdmin" (click)="openCreate()" class="btn-outline">Create your first ticket</button>
      </div>

      <div class="ticket-grid" *ngIf="!loading && filtered.length > 0">
        <div class="ticket-card" *ngFor="let t of filtered">
          <div class="ticket-card-header">
            <div class="ticket-meta">
              <span class="badge" [ngClass]="priorityCls(t.priority)">{{ t.priority }}</span>
              <span class="badge status" [ngClass]="statusCls(t.status)">{{ t.status }}</span>
            </div>
            <!-- FIX NG8107: id is string (non-nullable), removed ?. operator -->
            <span class="ticket-id">#{{ t.id.slice(-6) }}</span>
          </div>

          <div class="ticket-category">{{ t.category }}</div>
          <p class="ticket-desc">{{ t.description }}</p>

          <div class="ticket-resource" *ngIf="t.resourceName">
            📍 {{ t.resourceName }}
          </div>

          <div class="ticket-attachments" *ngIf="t.attachments && t.attachments.length > 0">
            <span class="attach-label">📎 {{ t.attachments.length }} attachment(s)</span>
            <div class="thumb-row">
              <img *ngFor="let a of t.attachments"
                   [src]="backendBase + a" alt="attachment"
                   class="thumb" (click)="openImage(backendBase + a)" />
            </div>
          </div>

          <div class="ticket-footer">
            <span class="ticket-date">{{ t.createdAt | date:'dd MMM yyyy' }}</span>
            <div class="ticket-actions">
              <!-- Technician: update status -->
              <ng-container *ngIf="isTechnician || isAdmin">
                <select (change)="changeStatus(t, $any($event.target).value)"
                        [value]="t.status" class="status-select">
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="CLOSED">CLOSED</option>
                  <option *ngIf="isAdmin" value="REJECTED">REJECTED</option>
                </select>
              </ng-container>
              <!-- Student: view details / add image -->
              <button *ngIf="!isTechnician" (click)="openDetail(t)" class="btn-sm">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════ CREATE TICKET MODAL ════════════════════════════ -->
    <div class="modal-overlay" *ngIf="showCreate" (click)="closeCreate()">
      <div class="modal-box" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>Create Maintenance Ticket</h3>
          <button class="modal-close" (click)="closeCreate()">✕</button>
        </div>

        <div class="modal-body">
          <div *ngIf="createError" class="alert alert-error">{{ createError }}</div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Facility / Resource *</label>
              <select [(ngModel)]="newTicket.resourceId" name="resource"
                      (change)="setResourceName()">
                <option value="">Select a resource…</option>
                <option *ngFor="let f of activeFacilities" [value]="f.id">
                  {{ f.name }} ({{ f.type }})
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Category *</label>
              <select [(ngModel)]="newTicket.category" name="category">
                <option value="">Choose category…</option>
                <option *ngFor="let c of categories" [value]="c">{{ c }}</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Priority *</label>
              <select [(ngModel)]="newTicket.priority" name="priority">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Contact Details (optional)</label>
              <input [(ngModel)]="newTicket.contactDetails" name="contact"
                     placeholder="Phone or email" />
            </div>
          </div>

          <div class="form-group" style="margin-top:12px">
            <label class="form-label">Description *</label>
            <textarea [(ngModel)]="newTicket.description" name="description"
                      rows="4" placeholder="Describe the issue in detail…"></textarea>
          </div>

          <!-- Image attachments -->
          <div class="form-group" style="margin-top:12px">
            <label class="form-label">Image Evidence (up to 3 images)</label>
            <div class="upload-zone" (click)="fileInput.click()"
                 [class.over]="dragOver"
                 (dragover)="dragOver=true; $event.preventDefault()"
                 (dragleave)="dragOver=false"
                 (drop)="onDrop($event)">
              <input #fileInput type="file" accept="image/*" multiple hidden
                     (change)="onFilesSelected($event)" />
              <span *ngIf="pendingFiles.length === 0">
                📷 Click or drag images here (JPEG, PNG, GIF — max 5 MB each)
              </span>
              <div *ngIf="pendingFiles.length > 0" class="pending-list">
                <span *ngFor="let f of pendingFiles" class="file-chip">
                  🖼 {{ f.name }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button (click)="closeCreate()" class="btn-secondary">Cancel</button>
          <button (click)="submitCreate()" [disabled]="creating" class="btn-primary">
            {{ creating ? 'Submitting…' : 'Submit Ticket' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ══════════════════ DETAIL / UPDATE STATUS MODAL ═══════════════════ -->
    <div class="modal-overlay" *ngIf="detailTicket" (click)="detailTicket=null">
      <div class="modal-box wide" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <!-- FIX NG8107: id is string (non-nullable), removed ?. operator -->
          <h3>Ticket #{{ detailTicket.id.slice(-6) }}</h3>
          <button class="modal-close" (click)="detailTicket=null">✕</button>
        </div>

        <div class="modal-body detail-body">
          <div class="detail-row">
            <span class="detail-key">Status</span>
            <span class="badge status" [ngClass]="statusCls(detailTicket.status)">{{ detailTicket.status }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-key">Priority</span>
            <span class="badge" [ngClass]="priorityCls(detailTicket.priority)">{{ detailTicket.priority }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-key">Category</span><span>{{ detailTicket.category }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-key">Resource</span><span>{{ detailTicket.resourceName || detailTicket.resourceId }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-key">Description</span><span>{{ detailTicket.description }}</span>
          </div>
          <div class="detail-row" *ngIf="isAdmin">
            <span class="detail-key">Assign To</span>
            <select [ngModel]="detailTicket.assignedTo || ''"
                    (ngModelChange)="assignTechnician(detailTicket, $event)">
              <option value="">Select technician…</option>
              <option *ngFor="let tech of technicians" [value]="tech.id">{{ tech.fullName }}</option>
            </select>
          </div>
          <div class="detail-row" *ngIf="detailTicket.resolutionNote">
            <span class="detail-key">Resolution</span><span>{{ detailTicket.resolutionNote }}</span>
          </div>
          <div class="detail-row" *ngIf="detailTicket.rejectionReason">
            <span class="detail-key">Rejection Reason</span>
            <span class="text-danger">{{ detailTicket.rejectionReason }}</span>
          </div>

          <!-- Attachments -->
          <div *ngIf="detailTicket.attachments?.length" class="attachments-section">
            <strong>Attachments:</strong>
            <div class="thumb-row" style="margin-top:8px">
              <img *ngFor="let a of detailTicket.attachments"
                   [src]="backendBase + a" alt="attachment"
                   class="thumb-lg" (click)="openImage(backendBase + a)" />
            </div>
          </div>

          <!-- Add more images (if < 3) -->
          <div *ngIf="!isTechnician && !isAdmin && (detailTicket.attachments?.length || 0) < 3" style="margin-top:12px">
            <label class="form-label">Add Image</label>
            <input type="file" accept="image/*" (change)="uploadToExisting($event, detailTicket)" />
          </div>

          <!-- Comments -->
          <div class="comments-section" style="margin-top:16px">
            <strong>Comments ({{ detailTicket.comments?.length || 0 }})</strong>
            <div class="comment" *ngFor="let c of detailTicket.comments">
              <div class="comment-header">
                <span class="comment-author">{{ c.userFullName }}</span>
                <span class="comment-date">{{ c.createdAt | date:'dd MMM HH:mm' }}</span>
                <button *ngIf="c.userId === currentUser?.id"
                        (click)="beginEditComment(c)" class="btn-xs">Edit</button>
                <button *ngIf="c.userId === currentUser?.id"
                        (click)="deleteComment(detailTicket, c.id)" class="btn-xs danger">✕</button>
              </div>
              <p class="comment-text" *ngIf="editingCommentId !== c.id">{{ c.text }}</p>
              <div *ngIf="editingCommentId === c.id" class="edit-comment">
                <textarea [(ngModel)]="editingCommentText" rows="2"></textarea>
                <div style="display:flex; gap:8px; margin-top:6px;">
                  <button class="btn-xs" (click)="saveCommentEdit(detailTicket, c.id)">Save</button>
                  <button class="btn-xs danger" (click)="cancelCommentEdit()">Cancel</button>
                </div>
              </div>
            </div>

            <div class="add-comment" *ngIf="!isTechnician && !isAdmin">
              <textarea [(ngModel)]="newComment" rows="2" placeholder="Add a comment…"></textarea>
              <button (click)="submitComment(detailTicket)" class="btn-sm">Post</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════ IMAGE LIGHTBOX ═════════════════════════════════ -->
    <div class="lightbox" *ngIf="lightboxUrl" (click)="lightboxUrl=null">
      <img [src]="lightboxUrl" alt="full size" />
      <button class="lightbox-close">✕</button>
    </div>
  `,
  styles: [`
    .page-wrapper { max-width: 1100px; margin: 0 auto; padding: 0 16px; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
    .page-title { font-size: 24px; font-weight: 700; color: #1f2937; margin: 0; }
    .page-subtitle { font-size: 14px; color: #6b7280; margin: 4px 0 0; }

    .stats-bar { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; }
    .stat-pill { display: flex; align-items: center; gap: 6px; background: white; border: 1px solid #e5e7eb; border-radius: 999px; padding: 6px 14px; font-size: 13px; }
    .dot { width: 8px; height: 8px; border-radius: 50%; }
    .dot.open { background: #f59e0b; }
    .dot.progress { background: #3b82f6; }
    .dot.resolved { background: #10b981; }
    .dot.closed { background: #9ca3af; }

    .filter-row { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px; }
    .filter-row select, .search-input { padding: 8px 12px; border: 1.5px solid #d1d5db; border-radius: 8px; font-size: 14px; }
    .search-input { flex: 1; min-width: 200px; }

    .loading-state { text-align: center; padding: 40px; color: #6b7280; }
    .empty-state { text-align: center; padding: 60px 20px; color: #6b7280; }
    .empty-icon { font-size: 48px; display: block; margin-bottom: 12px; }
    .btn-outline { background: transparent; border: 2px solid #1f5eff; color: #1f5eff; padding: 8px 20px; border-radius: 8px; cursor: pointer; }

    .ticket-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 16px; }
    .ticket-card { background: white; border-radius: 12px; border: 1px solid #e5e7eb; padding: 20px; transition: box-shadow .2s; }
    .ticket-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,.08); }
    .ticket-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .ticket-meta { display: flex; gap: 6px; }
    .ticket-id { font-size: 12px; color: #9ca3af; font-family: monospace; }
    .ticket-category { font-weight: 600; font-size: 15px; color: #374151; margin-bottom: 6px; }
    .ticket-desc { font-size: 14px; color: #6b7280; margin: 0 0 8px; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .ticket-resource { font-size: 13px; color: #6b7280; margin-bottom: 8px; }

    .ticket-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; }
    .ticket-date { font-size: 12px; color: #9ca3af; }
    .ticket-actions { display: flex; gap: 8px; align-items: center; }
    .status-select { padding: 4px 8px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 12px; }

    .thumb-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 6px; }
    .thumb { width: 64px; height: 64px; object-fit: cover; border-radius: 6px; cursor: pointer; border: 2px solid #e5e7eb; }
    .thumb:hover { border-color: #1f5eff; }
    .thumb-lg { width: 120px; height: 120px; object-fit: cover; border-radius: 8px; cursor: pointer; border: 2px solid #e5e7eb; }
    .attach-label { font-size: 12px; color: #6b7280; }

    .badge { padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
    .badge.LOW      { background: #f3f4f6; color: #374151; }
    .badge.MEDIUM   { background: #fef3c7; color: #92400e; }
    .badge.HIGH     { background: #fee2e2; color: #991b1b; }
    .badge.URGENT   { background: #dc2626; color: white; }
    .badge.status.OPEN        { background: #fef3c7; color: #92400e; }
    .badge.status.IN_PROGRESS { background: #dbeafe; color: #1e40af; }
    .badge.status.RESOLVED    { background: #d1fae5; color: #065f46; }
    .badge.status.CLOSED      { background: #f3f4f6; color: #374151; }
    .badge.status.REJECTED    { background: #fee2e2; color: #991b1b; }

    /* Buttons */
    .btn-primary  { background: #1f5eff; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; }
    .btn-primary:hover:not(:disabled) { background: #1a47cc; }
    .btn-primary:disabled { opacity: .6; cursor: not-allowed; }
    .btn-secondary { background: #f3f4f6; color: #374151; border: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; cursor: pointer; }
    .btn-sm  { background: #1f5eff; color: white; border: none; padding: 6px 14px; border-radius: 6px; font-size: 12px; cursor: pointer; }
    .btn-xs  { padding: 2px 8px; border-radius: 4px; font-size: 11px; border: none; cursor: pointer; background: #f3f4f6; }
    .btn-xs.danger { background: #fee2e2; color: #991b1b; }

    /* Modal */
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.4); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
    .modal-box { background: white; border-radius: 16px; width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,.2); }
    .modal-box.wide { max-width: 680px; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px 0; }
    .modal-header h3 { margin: 0; font-size: 18px; }
    .modal-close { background: none; border: none; font-size: 18px; cursor: pointer; color: #6b7280; padding: 4px; }
    .modal-body  { padding: 20px 24px; }
    .modal-footer { padding: 0 24px 20px; display: flex; justify-content: flex-end; gap: 10px; }

    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-label { font-weight: 500; font-size: 14px; color: #374151; }
    input, select, textarea { padding: 9px 12px; border: 1.5px solid #d1d5db; border-radius: 8px; font-size: 14px; font-family: inherit; }
    textarea { resize: vertical; }
    input:focus, select:focus, textarea:focus { outline: none; border-color: #1f5eff; }

    .upload-zone { border: 2px dashed #d1d5db; border-radius: 8px; padding: 20px; text-align: center; cursor: pointer; color: #6b7280; font-size: 14px; transition: border-color .2s, background .2s; }
    .upload-zone:hover, .upload-zone.over { border-color: #1f5eff; background: #eff6ff; }
    .pending-list { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
    .file-chip { background: #e0f2fe; color: #0369a1; padding: 4px 12px; border-radius: 999px; font-size: 12px; }

    .alert-error { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; padding: 10px 14px; border-radius: 8px; font-size: 14px; margin-bottom: 12px; }

    /* Detail */
    .detail-body { display: flex; flex-direction: column; gap: 10px; }
    .detail-row { display: flex; gap: 12px; align-items: flex-start; font-size: 14px; }
    .detail-key { min-width: 110px; font-weight: 600; color: #6b7280; }
    .text-danger { color: #991b1b; }
    .attachments-section { margin-top: 8px; }

    /* Comments */
    .comments-section { border-top: 1px solid #e5e7eb; padding-top: 16px; }
    .comment { background: #f9fafb; border-radius: 8px; padding: 12px; margin-top: 10px; }
    .comment-header { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
    .comment-author { font-weight: 600; font-size: 13px; }
    .comment-date { font-size: 12px; color: #9ca3af; flex: 1; }
    .comment-text { margin: 0; font-size: 14px; color: #374151; }
    .add-comment { display: flex; gap: 8px; margin-top: 12px; align-items: flex-end; }
    .add-comment textarea { flex: 1; }

    /* Lightbox */
    .lightbox { position: fixed; inset: 0; background: rgba(0,0,0,.85); display: flex; align-items: center; justify-content: center; z-index: 2000; cursor: pointer; }
    .lightbox img { max-width: 90vw; max-height: 90vh; border-radius: 8px; }
    .lightbox-close { position: absolute; top: 20px; right: 24px; background: none; border: none; color: white; font-size: 28px; cursor: pointer; }

    @media(max-width:500px){ .form-grid{ grid-template-columns:1fr; } }
  `]
})
export class TicketsPage implements OnInit {
  tickets:  Ticket[]  = [];
  filtered: Ticket[]  = [];
  activeFacilities: Facility[] = [];
  technicians: Technician[] = [];
  loading  = true;
  creating = false;
  dragOver = false;

  filterStatus   = '';
  filterPriority = '';
  filterSearch   = '';

  showCreate   = false;
  detailTicket: Ticket | null = null;
  lightboxUrl: string | null  = null;
  newComment = '';

  createError = '';
  pendingFiles: File[] = [];

  backendBase = 'http://localhost:8080';
  currentUser: any = null;
  isTechnician = false;
  isAdmin = false;
  editingCommentId: string | null = null;
  editingCommentText = '';

  // FIX TS2345: priority typed as the union literal so it matches Ticket['priority']
  newTicket: {
    resourceId: string;
    resourceName: string;
    category: string;
    priority: Ticket['priority'];
    description: string;
    contactDetails: string;
  } = {
    resourceId: '', resourceName: '', category: '',
    priority: 'MEDIUM', description: '', contactDetails: ''
  };

  categories = ['ELECTRICAL', 'PLUMBING', 'IT_EQUIPMENT', 'FURNITURE', 'HVAC', 'CLEANING', 'OTHER'];
  priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
  statuses   = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'];

  get statusCounts() {
    return [
      { label: 'Open',        cls: 'open',     count: this.tickets.filter(t => t.status === 'OPEN').length },
      { label: 'In Progress', cls: 'progress', count: this.tickets.filter(t => t.status === 'IN_PROGRESS').length },
      { label: 'Resolved',    cls: 'resolved', count: this.tickets.filter(t => t.status === 'RESOLVED').length },
      { label: 'Closed',      cls: 'closed',   count: this.tickets.filter(t => t.status === 'CLOSED').length },
    ];
  }

  constructor(
    private svc: TicketsService,
    private auth: AuthService,
    private http: HttpClient,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.currentUser = this.auth.getCurrentUser();
    this.isTechnician = this.currentUser?.role === 'ROLE_TECHNICIAN';
    this.isAdmin = this.currentUser?.role === 'ROLE_ADMIN';
    this.loadFacilities();
    this.loadTechnicians();
    this.loadTickets();
  }

  loadFacilities() {
    this.http.get<Facility[]>(`${API_BASE}/facilities/active`).subscribe({
      next: f => this.activeFacilities = f,
      error: () => {}
    });
  }

  loadTechnicians() {
    if (!this.isAdmin) return;
    this.http.get<Technician[]>(`${API_BASE}/admin/technicians`).subscribe({
      next: list => this.technicians = list.filter(t => !!t.id),
      error: () => {}
    });
  }

  loadTickets() {
    this.loading = true;
    const obs = this.isAdmin
      ? this.svc.all()
      : (this.isTechnician ? this.svc.assigned() : this.svc.mine());

    obs.subscribe({
      next: t => { this.tickets = t; this.applyFilter(); this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  applyFilter() {
    this.filtered = this.tickets.filter(t => {
      const matchStatus   = !this.filterStatus   || t.status   === this.filterStatus;
      const matchPriority = !this.filterPriority || t.priority === this.filterPriority;
      const matchSearch   = !this.filterSearch   ||
        (t.description || '').toLowerCase().includes(this.filterSearch.toLowerCase()) ||
        (t.category    || '').toLowerCase().includes(this.filterSearch.toLowerCase());
      return matchStatus && matchPriority && matchSearch;
    });
  }

  setResourceName() {
    const f = this.activeFacilities.find(f => f.id === this.newTicket.resourceId);
    this.newTicket.resourceName = f?.name || '';
  }

  openCreate() {
    this.newTicket   = { resourceId: '', resourceName: '', category: '', priority: 'MEDIUM', description: '', contactDetails: '' };
    this.pendingFiles = [];
    this.createError  = '';
    this.showCreate   = true;
  }

  closeCreate() { this.showCreate = false; }

  onFilesSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files) this.addFiles(Array.from(input.files));
  }

  onDrop(e: DragEvent) {
    e.preventDefault();
    this.dragOver = false;
    if (e.dataTransfer?.files) this.addFiles(Array.from(e.dataTransfer.files));
  }

  addFiles(files: File[]) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const remaining = 3 - this.pendingFiles.length;
    for (const file of files.slice(0, remaining)) {
      if (!allowedTypes.includes(file.type)) {
        this.createError = `Unsupported image type: ${file.name}`;
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.createError = `Image exceeds 5 MB: ${file.name}`;
        continue;
      }
      this.pendingFiles.push(file);
    }
    if (files.length > remaining) {
      this.createError = 'Only 3 images are allowed per ticket.';
    }
  }

  submitCreate() {
    if (!this.newTicket.resourceId || !this.newTicket.category || !this.newTicket.description.trim()) {
      this.createError = 'Please fill in all required fields.';
      return;
    }
    this.creating    = true;
    this.createError = '';

    // FIX TS2345: explicitly type payload as Partial<Ticket> so priority union is preserved
    const payload: Partial<Ticket> = {
      ...this.newTicket,
      userId: this.currentUser?.id,
      status: 'OPEN',
    };

    this.svc.create(payload).subscribe({
      next: ticket => {
        // FIX TS2769 + TS2339: type accumulator as Promise<unknown> and wrap fn() call
        // so TypeScript resolves the correct reduce overload
        const uploads = this.pendingFiles.map(f => () => this.svc.upload(ticket.id, f).toPromise());
        uploads.reduce(
          (p: Promise<unknown>, fn) => p.then(() => fn()),
          Promise.resolve() as Promise<unknown>
        ).then(() => {
          this.creating = false;
          this.showCreate = false;
          this.toast.show('Ticket created successfully!');
          this.loadTickets();
        });
      },
      error: err => {
        this.creating    = false;
        this.createError = err.error?.message || 'Failed to create ticket';
      }
    });
  }

  uploadToExisting(e: Event, ticket: Ticket) {
    const input = e.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      this.toast.show('Only JPEG, PNG, GIF, and WebP images are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.toast.show('Image size must not exceed 5 MB');
      return;
    }
    this.svc.upload(ticket.id, file).subscribe({
      next: updated => {
        Object.assign(ticket, updated);
        this.toast.show('Image uploaded!');
      },
      error: err => this.toast.show(err.error?.message || 'Upload failed')
    });
  }

  openDetail(t: Ticket) { this.detailTicket = { ...t }; this.newComment = ''; }

  assignTechnician(ticket: Ticket, technicianId: string) {
    if (!technicianId) return;
    this.http.put<Ticket>(`${API_BASE}/admin/tickets/${ticket.id}/assign`, { technicianId }).subscribe({
      next: updated => {
        Object.assign(ticket, updated);
        this.detailTicket = { ...ticket };
        this.toast.show('Technician assigned');
      },
      error: err => this.toast.show(err.error?.message || 'Assignment failed')
    });
  }

  changeStatus(t: Ticket, status: string) {
    const note = status === 'REJECTED'
      ? prompt('Enter rejection reason') || ''
      : ((status === 'RESOLVED' || status === 'CLOSED') ? (prompt('Enter resolution note (optional)') || '') : '');
    if (status === 'REJECTED' && !note.trim()) {
      this.toast.show('Rejection reason is required');
      return;
    }
    this.svc.updateStatus(t.id, status, note).subscribe({
      next: updated => { Object.assign(t, updated); this.toast.show('Status updated'); },
      error: err => this.toast.show(err.error?.message || 'Update failed')
    });
  }

  submitComment(ticket: Ticket) {
    if (!this.newComment.trim()) return;
    this.svc.addComment(ticket.id, {
      text: this.newComment
    } as any).subscribe({
      next: updated => {
        Object.assign(ticket, updated);
        this.detailTicket = { ...ticket };
        this.newComment   = '';
      }
    });
  }

  deleteComment(ticket: Ticket, commentId: string) {
    this.svc.deleteComment(ticket.id, commentId).subscribe({
      next: updated => { Object.assign(ticket, updated); this.detailTicket = { ...ticket }; }
    });
  }

  beginEditComment(comment: any) {
    this.editingCommentId = comment.id;
    this.editingCommentText = comment.text;
  }

  saveCommentEdit(ticket: Ticket, commentId: string) {
    if (!this.editingCommentText.trim()) {
      this.toast.show('Comment cannot be empty');
      return;
    }
    this.svc.updateComment(ticket.id, commentId, this.editingCommentText).subscribe({
      next: updated => {
        Object.assign(ticket, updated);
        this.detailTicket = { ...ticket };
        this.editingCommentId = null;
        this.editingCommentText = '';
      },
      error: err => this.toast.show(err.error?.message || 'Failed to update comment')
    });
  }

  cancelCommentEdit() {
    this.editingCommentId = null;
    this.editingCommentText = '';
  }

  openImage(url: string) { this.lightboxUrl = url; }

  priorityCls(p: string) { return p; }
  statusCls(s: string)   { return s?.replace('_', '') === 'INPROGRESS' ? 'IN_PROGRESS' : s; }
}