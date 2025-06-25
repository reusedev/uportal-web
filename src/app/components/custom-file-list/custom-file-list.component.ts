/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { NzImageService } from 'ng-zorro-antd/image';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { PublicModule } from '../../public.module';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface FileItem {
  id: string;
  url: string;
}

@Component({
  standalone: true,
  selector: 'app-customer-file-list',
  templateUrl: './custom-file-list.component.html',
  styleUrls: ['./custom-file-list.component.css'],
  imports: [
    PublicModule,
    CommonModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomFileListComponent),
      multi: true,
    },
  ],
})
export class CustomFileListComponent implements ControlValueAccessor, OnInit {
  ngChange: (value: any) => void = () => undefined;
  ngTouched: (value: any) => void = () => undefined;
  message = inject(NzMessageService);
  img = inject(NzImageService);
  http = inject(HttpClient);
  cdr = inject(ChangeDetectorRef);
  fileList: NzUploadFile[] = [];

  resultValue:any

  @Input() props: {
    mode: 'single' | 'multiple';
    limit: number;
    exts?: string;
    size?: number;
    listType: 'text' | 'picture' | 'picture-card';
    showButton?: boolean;
  } = {
    mode: 'multiple',
    limit: 10,
    exts: '',
    size: 0,
    listType: 'text',
    showButton: true,
  };

  get showButton() {
    if (!this.props.showButton) {
      return false;
    }
    const limit = this.props.mode === 'single' ? 1 : this.props.limit;
    if (
      this.props.listType === 'picture-card' &&
      this.fileList.length >= limit
    ) {
      return false;
    }
    return true;
  }

  // 校验器
  guards: ((file: NzUploadFile) => string | null)[] = [
    () => {
      const limit = this.props.mode === 'single' ? 1 : this.props.limit;
      if (!limit) {
        return null;
      }

      if (limit > this.fileList.length) {
        return null;
      }

      return `最多允许上传 ${limit} 个文件`;
    },
    (file: NzUploadFile) => {
      const exts = this.props.exts?.trim();
      if (!exts) {
        return null;
      }

      const extList = exts.split(',').map((ext: string) => ext.trim());
      const ext = file.name.substring(file.name.lastIndexOf('.'));
      if (extList.includes(ext)) {
        return null;
      }

      return `仅允许上传文件后缀为 ${exts} 的文件`;
    },
    (file: NzUploadFile) => {
      const maxSize = this.props.size;
      if (!maxSize) {
        return null;
      }

      if (maxSize >= (file.size ?? 0)) {
        return null;
      }

      const size = this.getFileSize(maxSize);

      return `请上传大小限制为 ${size} 内的文件`;
    },
  ];

  beforeUpload = (file: NzUploadFile) => {
    const err = this.guards.some(
      (fn: (file: NzUploadFile) => string | null) => {
        const errmsg = fn(file);
        if (errmsg) {
          this.message.error(errmsg);
          return true;
        } else {
          return false;
        }
      }
    );
    return err === false;
  };

  ngOnInit() {}

  getFileSize(size: number) {
    if (!size) return 0;
    let index = 0;
    const unit = ['B', 'KB', 'MB', 'GB', 'TB'];
    while (size) {
      if (size % 1024 === 0) {
        size = size / 1024;
        index++;
      } else {
        break;
      }
    }
    return `${size} ${unit[index]}`;
  }

  customRequest = (item: any) => {
    const formData = new FormData();
    formData.append('file', item.file as unknown as File);

    return this.http
      .request<any>(
        new HttpRequest('post', '/admin/public/upload', formData, {
          reportProgress: true,
        })
      )
      .subscribe({
        next: (event: HttpEvent<any>) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.fileList = this.fileList.map((file: any) => {
              if (file.uid === item.file.uid) {
                file.loading = 'start';
                if (event.total! > 0) {
                  file.percent = (event.loaded / event.total!) * 100;
                  file.total = event.total!;
                  file.loaded = event.loaded;
                  if (file.percent === 100) {
                    file.loading = 'end';
                  }
                }
              }
              return file;
            });

            item.onProgress!(event, item.file);
          } else if (event instanceof HttpResponse) {
            const { data } = event.body;
            const body = {
              id: data.id,
              uid: item.file.uid,
              name: item.file.name,
              url: data.url,
            };

            item.onSuccess!(body, item.file, event);
            this.onChange();
            this.cdr.markForCheck();
          }
        },
        error: (err) => {
          item.onError!(err, item.file);
        },
      });
  };

  onUploadChange($event: NzUploadChangeParam) {
    const { type, file, fileList } = $event;
    if (type === 'success') {
      const target = fileList.find((item) => item.uid === file.uid);
      if (target) {
        Object.assign(target, file.response);
        this.cdr.markForCheck();
      }
    }
  }

  onRemove = ($event: NzUploadFile) => {
    this.fileList = this.fileList.filter((file) => file.uid !== $event.uid);
    this.onChange();
    return true;
  };

  onPreview = (file: NzUploadFile) => {
    if (['picture', 'picture-card'].includes(this.props.listType)) {
      this.img.preview([{ src: file.url! }]);
    } else {
      this.download(file.response?.url ?? file.url);
    }
  };

  onDownload = (file: NzUploadFile) => {
    const url = file.response?.url ?? file.url;
    this.download(url);
  };

  download(url: string) {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.click();
  }

  onChange() {
    const list: FileItem[] = [];
    this.fileList.forEach((item: any) => {
      if (item.status === 'done') {
        list.push({
          id: item.response?.id || item.id,
          url: item.response?.url || item.url,
        });
      }
    });
    if (this.props.mode === 'single') {
      if (list.length) {
        // this.formControl.setValue(list[list.length - 1] ?? null);
        this.resultValue = list[list.length - 1] ?? null;
      } else {
        // this.formControl.setValue(null);
        this.resultValue = null;
      }
    } else {
      // this.formControl.setValue(list);
      this.resultValue = list;
    }

    this.ngChange(this.resultValue);

  }

  transform(size: number): any {
    if (isNaN(size)) {
      return '不可用';
    } else if (size === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(size) / Math.log(k));

    if (!sizes[i]) {
      return '超出范围';
    }

    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  writeValue(result: any) {
    if (!result) {
      this.fileList = [];
      return;
    }
    const value = Array.isArray(result) ? result : [result];

    if (value.length > 0) {
      this.fileList = value.map((item: FileItem) => {
        const { id, url } = item;
        const cachedItem = this.fileList.find((file) => file.uid === id);
        if (cachedItem) {
          return cachedItem;
        } else {
          return {
            uid: id,
            name: id, // 使用id作为名称
            url: url,
            status: 'done',
          } as NzUploadFile;
        }
      });
    }
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: any) => void): void {
    this.ngChange = fn;
  }

  registerOnTouched(fn: (value: any) => void): void {
    this.ngTouched = fn;
  }
}
