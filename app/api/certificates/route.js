import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET() {
  try {
    // সনদগুলোর তালিকা নেবে, ক্রিয়েশন তারিখ অনুযায়ী সাজিয়ে
    const certificates = await prisma.certificate.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return Response.json({ success: true, certificates })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const body = await req.json()

    // id থাকলে মুছে ফেলো
    if ('id' in body) delete body.id

    if (body.birthDate) body.birthDate = new Date(body.birthDate)
    if (body.issuedDate) body.issuedDate = new Date(body.issuedDate)

    const certificate = await prisma.certificate.create({
      data: {
        ...body,
      },
    })

    return Response.json({ success: true, certificate }, { status: 201 })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PATCH(req) {
  try {
    const url = new URL(req.url)
    const id = parseInt(url.searchParams.get('id'))
    if (!id) return Response.json({ success: false, error: 'ID missing' }, { status: 400 })

    const body = await req.json()

    if ('id' in body) delete body.id

    if (body.birthDate) body.birthDate = new Date(body.birthDate)
    if (body.issuedDate) body.issuedDate = new Date(body.issuedDate)

    const certificate = await prisma.certificate.update({
      where: { id },
      data: {
        ...body,
      },
    })

    return Response.json({ success: true, certificate })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}


export async function DELETE(req) {
  try {
    const url = new URL(req.url)
    const id = parseInt(url.searchParams.get('id'))
    if (!id) return Response.json({ success: false, error: 'ID missing' }, { status: 400 })

    await prisma.certificate.delete({ where: { id } })

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
